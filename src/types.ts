export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  createdAt: number;
}

export interface TrainingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  description?: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  rating: number;
  image?: string;
}

export interface Transformation {
  id: string;
  clientName: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  result: string;
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: 'fitness' | 'nutrition' | 'lifestyle';
  image: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  goal: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  createdAt: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
}

export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    description: string;
    calories: number;
  }[];
}
