import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  LineChart, 
  Settings, 
  LogOut, 
  Plus,
  TrendingUp,
  Clock,
  Flame,
  Download,
  Users,
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { generateMealPlan } from '@/lib/gemini';
import { jsPDF } from 'jspdf';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logOut, db, handleFirestoreError, updateUserProfile } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import UserAvatar from '../components/UserAvatar';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [generatingMeal, setGeneratingMeal] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);
  const [coupon, setCoupon] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.photoURL || '');

  useEffect(() => {
    if (user) {
      setProfileName(current => current || user.displayName || '');
      setProfilePhoto(current => current || user.photoURL || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateUserProfile(profileName, profilePhoto);
      toast.success("Identity Matrix Updated");
    } catch (e: any) {
      toast.error("Profile update failed");
    } finally {
      setUpdatingProfile(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'users', user.uid, 'workoutLogs'),
        orderBy('date', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setWorkoutLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        handleFirestoreError(error, 'list', `/users/${user.uid}/workoutLogs`);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-neon uppercase font-black tracking-widest italic">Authenticating Access...</div>;
  }

  const downloadMealPlan = async () => {
    setGeneratingMeal(true);
    const plan = await generateMealPlan("Weight Loss", "High Protein", 2200);
    
    if (plan) {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("Elite Nutrition Blueprint", 20, 20);
      doc.setFontSize(14);
      doc.text(`Daily Calorie Target: 2200 kcal`, 20, 30);
      doc.text("---------------------------------", 20, 35);
      
      let y = 50;
      Object.entries(plan).forEach(([meal, details]: [string, any]) => {
        doc.setFontSize(16);
        doc.text(meal.toUpperCase(), 20, y);
        doc.setFontSize(12);
        doc.text(details.description || JSON.stringify(details), 20, y + 10);
        y += 30;
      });

      doc.save("MikeJohnson_MealPlan.pdf");
    }
    setGeneratingMeal(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-luxury-gray border-r border-white/5 flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-neon rounded-sm">
            <Dumbbell className="w-5 h-5 text-black" />
          </div>
          <span className="font-display text-xl font-bold tracking-tighter uppercase italic text-white leading-none">
            MIKE FITNESS
          </span>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'workouts', icon: Dumbbell, label: 'Workouts' },
            { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
            { id: 'progress', icon: LineChart, label: 'Progress' },
            { id: 'referrals', icon: Users, label: 'Referrals' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-neon text-black' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <Button 
          onClick={async () => {
            await logOut();
            navigate('/');
          }}
          variant="ghost" className="justify-start text-white/40 hover:text-red-500 hover:bg-red-500/10 p-4"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">Welcome Back, {user?.displayName?.split(' ')[0]}</span>
            <h1 className="text-4xl font-display font-black uppercase italic text-white leading-none mt-2">Elite Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={async () => {
                try {
                  await addDoc(collection(db, 'users', user.uid, 'workoutLogs'), {
                    date: new Date().toISOString().split('T')[0],
                    exercises: [
                      { name: 'Deadlift', sets: 5, reps: 5, weight: 140 }
                    ],
                    createdAt: serverTimestamp()
                  });
                  toast.success("Workout Logged!");
                } catch (e: any) {
                  handleFirestoreError(e, 'create');
                }
              }}
              className="bg-white/5 border border-white/10 hover:bg-neon hover:text-black transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              <Plus className="w-4 h-4 mr-2" /> Log Workout
            </Button>
            <Button onClick={downloadMealPlan} disabled={generatingMeal} className="bg-neon text-black hover:bg-white transition-all font-bold uppercase tracking-widest text-[10px]">
              {generatingMeal ? "Generating..." : <><Download className="w-4 h-4 mr-2" /> Meal PDF</>}
            </Button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-luxury-gray border-white/5 p-6 group cursor-pointer hover:border-neon transition-all" onClick={() => navigate('/meal-planner')}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-neon/10 rounded-lg">
                    <Utensils className="w-6 h-6 text-neon" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-neon" />
                </div>
                <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Meal Architect</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-display font-black text-white italic leading-none uppercase">Generate Plan</span>
                </div>
              </Card>
              <Card className="bg-luxury-gray border-white/5 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-neon/10 rounded-lg">
                    <Flame className="w-6 h-6 text-neon" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Active Calories</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-display font-black text-white italic leading-none">1,240</span>
                  <span className="text-xs font-bold text-white/40">kcal</span>
                </div>
              </Card>
              <Card className="bg-luxury-gray border-white/5 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-neon/10 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-neon" />
                  </div>
                  <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">+12%</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Total Volume</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-display font-black text-white italic leading-none">12,450</span>
                  <span className="text-xs font-bold text-white/40">kg</span>
                </div>
              </Card>
              <Card className="bg-luxury-gray border-white/5 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-neon/10 rounded-lg">
                    <Clock className="w-6 h-6 text-neon" />
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Time Trained</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-display font-black text-white italic leading-none">42.5</span>
                  <span className="text-xs font-bold text-white/40">hrs</span>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-luxury-gray border-white/5 p-8">
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-xl font-display font-black uppercase italic text-white">Volume Progression</CardTitle>
                </CardHeader>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { date: 'Mon', value: 8200 },
                      { date: 'Tue', value: 8500 },
                      { date: 'Wed', value: 9100 },
                      { date: 'Thu', value: 8800 },
                      { date: 'Fri', value: 9500 },
                      { date: 'Sat', value: 10200 },
                      { date: 'Sun', value: 9800 },
                    ]}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FF00" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#141414', border: '1px solid #ffffff10', borderRadius: '8px' }}
                        itemStyle={{ color: '#00FF00' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#00FF00" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="bg-luxury-gray border-white/5 p-8">
                <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display font-black uppercase italic text-white italic">Recent Intel</CardTitle>
                  <Button variant="ghost" className="text-neon text-[8px] font-black uppercase tracking-widest">View All</Button>
                </CardHeader>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-6">
                    {workoutLogs.length === 0 ? (
                      <div className="py-20 text-center text-white/20 italic text-sm">No workout logs recorded yet.</div>
                    ) : workoutLogs.map((log, i) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 luxury-border">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                          <div>
                            <span className="block text-[8px] font-black tracking-widest uppercase text-white/40">{log.date}</span>
                            <span className="text-sm font-bold uppercase text-white mt-1">{log.exercises[0]?.name || 'Workout Session'}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center">
                          {log.exercises.length} Sets <ChevronRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-8">
            <Card className="bg-luxury-gray border-white/5 p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="max-w-md">
                   <h3 className="text-2xl font-display font-black uppercase italic text-white mb-2">AI Nutrition Laboratory</h3>
                   <p className="text-white/40 text-sm leading-relaxed">
                     Utilize our proprietary AI engine to architect a biological fuel protocol based on your specific metabolism and performance targets.
                   </p>
                </div>
                <Button 
                  onClick={() => navigate('/meal-planner')}
                  className="sleek-btn-primary h-14 px-10"
                >
                  Launch Architect
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card className="bg-luxury-gray border-white/5 p-8">
                  <h4 className="text-[10px] font-black uppercase text-neon tracking-widest mb-6">Archive | Nutrition Blueprints</h4>
                  <div className="space-y-4">
                     {/* We can fetch saved plans here too, but for simplicity we'll link to the planner */}
                     <div className="p-10 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center opacity-40">
                        <Utensils className="w-10 h-10 mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest mb-2">No active protocols in quick-view</span>
                        <p className="text-[10px] italic">Access the full Architect to manage your nutrition history.</p>
                     </div>
                  </div>
               </Card>

               <Card className="bg-luxury-gray border-white/5 p-8">
                  <h4 className="text-[10px] font-black uppercase text-neon tracking-widest mb-6">Metabolic Intel</h4>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-xs font-bold text-white/60">TDEE Estimation</span>
                        <span className="text-sm font-black text-white italic uppercase">2,840 Kcal</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-xs font-bold text-white/60">Protein Target</span>
                        <span className="text-sm font-black text-white italic uppercase">185g</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-xs font-bold text-white/60">Fiber Intake</span>
                        <span className="text-sm font-black text-white italic uppercase">35g</span>
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-luxury-gray border-white/5 p-8">
              <h3 className="text-2xl font-display font-black uppercase italic text-white mb-6">Referral Program</h3>
              <p className="text-white/60 mb-8">Invite your squad. When they join any protocol, you both get 20% off your next month.</p>
              <div className="p-6 bg-black luxury-border-neon flex justify-between items-center mb-8">
                <span className="font-mono text-neon font-bold tracking-widest">MIKE-TEAM-2024</span>
                <Button variant="ghost" className="text-neon text-[10px] font-bold uppercase tracking-widest">Copy Code</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 luxury-border">
                   <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Total Referrals</span>
                   <span className="text-2xl font-display font-bold text-white uppercase italic">3 Members</span>
                </div>
                <div className="p-4 bg-white/5 luxury-border">
                   <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Rewards Earned</span>
                   <span className="text-2xl font-display font-bold text-white uppercase italic">$150.00</span>
                </div>
              </div>
            </Card>

            <Card className="bg-luxury-gray border-white/5 p-8">
              <h3 className="text-2xl font-display font-black uppercase italic text-white mb-6">Active Coupons</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter Promo Code" 
                    className="bg-black border-white/10 text-white h-14 uppercase font-bold tracking-widest"
                  />
                  <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-neon text-black text-[10px] font-bold uppercase tracking-widest h-10">Apply</Button>
                </div>
                <div className="p-4 bg-neon/10 border border-neon/30 flex justify-between items-center">
                   <div>
                      <span className="block font-bold text-white text-xs uppercase tracking-widest">LOYALTY10</span>
                      <span className="text-[10px] text-neon uppercase font-bold tracking-tighter">10% OFF FOREVER</span>
                   </div>
                   <Check className="text-neon w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>
        )}
        {activeTab === 'workouts' && (
          <Card className="bg-luxury-gray border-white/5 p-8 flex flex-col items-center justify-center text-center py-24">
            <Dumbbell className="w-12 h-12 text-white/10 mb-6" />
            <h3 className="text-2xl font-display font-black uppercase italic text-white mb-2">Training Vault</h3>
            <p className="text-white/40 max-w-sm">Access your complete history of physical exertion and tactical training logs.</p>
            <Button className="mt-8 sleek-btn-primary">Initialize New Log</Button>
          </Card>
        )}

        {activeTab === 'progress' && (
          <Card className="bg-luxury-gray border-white/5 p-8 flex flex-col items-center justify-center text-center py-24">
            <LineChart className="w-12 h-12 text-white/10 mb-6" />
            <h3 className="text-2xl font-display font-black uppercase italic text-white mb-2">Biological Metrics</h3>
            <p className="text-white/40 max-w-sm">Deep-dive analysis of your strength markers, body composition, and performance trends.</p>
          </Card>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <Card className="bg-luxury-gray border-white/5 p-8">
              <h3 className="text-2xl font-display font-black uppercase italic text-white mb-8">Identity Protocol</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                  <UserAvatar user={{ ...user, displayName: profileName, photoURL: profilePhoto } as any} size="lg" className="ring-2 ring-neon/20" />
                  <div>
                    <span className="text-[10px] font-black text-neon uppercase tracking-widest block mb-1">Visual ID Rendering</span>
                    <p className="text-xs text-white/40">This is how you appear across the Elite Fitness infrastructure.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Public Callsign</label>
                    <Input 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-black border-white/10 h-12 font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Avatar Intel (Photo URL)</label>
                    <Input 
                      value={profilePhoto}
                      onChange={(e) => setProfilePhoto(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="bg-black border-white/10 h-12 text-xs" 
                    />
                    <p className="text-[8px] text-white/20 uppercase tracking-tight italic">Provide a secure URL for your biological representation.</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updatingProfile}
                  className="w-full sleek-btn-primary h-14 mt-4"
                >
                  {updatingProfile ? "Synchronizing..." : "Update Identity Matrix"}
                </Button>
              </form>
            </Card>

            <Card className="bg-red-500/5 border-red-500/20 p-8">
               <h4 className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-4">Danger Zone</h4>
               <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 text-xs font-bold uppercase tracking-widest">
                 Deactivate Elite Access
               </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
