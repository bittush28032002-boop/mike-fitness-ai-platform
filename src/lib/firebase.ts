import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, enableNetwork, disableNetwork, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Standard error handler for Firestore Permission Denied
export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  if (error.code === 'permission-denied' || error.message?.includes('insufficient permissions')) {
    const user = auth.currentUser;
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: user?.uid || 'anonymous',
        email: user?.email || '',
        emailVerified: user?.emailVerified || false,
        isAnonymous: user?.isAnonymous || true,
        providerInfo: user?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
}

// Test connection on boot as per guidelines
export async function testFirestoreConnection() {
  try {
    // Try to get a non-existent doc from server to check connectivity and basic config
    await getDocFromServer(doc(db, '_internal_', 'connectivity-check'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Firebase connection failed: Client is offline or Firestore is unreachable.");
    }
  }
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logOut() {
  await signOut(auth);
}

export async function updateUserProfile(displayName: string, photoURL: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  try {
    await updateProfile(user, { displayName, photoURL });
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      displayName,
      photoURL,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    if (error.code === 'not-found') {
      // If user doc doesn't exist yet, create it
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL,
        role: 'user',
        createdAt: serverTimestamp()
      });
    } else {
      handleFirestoreError(error, 'update', `/users/${user.uid}`);
    }
  }
}
