import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { generateMealPlan, MealPlanResponse } from '../services/mealPlannerService';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Target, Apple, Scale, Loader2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const MealPlanner = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState('muscle gain');
  const [preferences, setPreferences] = useState('');
  const [calories, setCalories] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlanResponse | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedPlans();
    }
  }, [user]);

  const fetchSavedPlans = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'users', user.uid, 'mealPlans'),
        orderBy('date', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedPlans(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to generate a personalized plan.");
      return;
    }

    setLoading(true);
    try {
      const plan = await generateMealPlan(goal, preferences, calories);
      setGeneratedPlan(plan);
      toast.success("AI Protocol Generated");
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Generation failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const saveToFirebase = async () => {
    if (!user || !generatedPlan) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'mealPlans'), {
        userId: user.uid,
        date: new Date().toISOString(),
        meals: generatedPlan.meals,
        totalCalories: generatedPlan.totalCalories,
        dietaryNote: generatedPlan.dietaryNote || '',
        goal,
        calories
      });
      toast.success("Blueprint Saved to Profile");
      fetchSavedPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save blueprint.");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-neon selection:text-black">
      <Navbar />
      
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Side: Configuration */}
          <div className="space-y-12">
            <div>
              <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-black">Performance Nutrition</span>
              <h1 className="text-6xl md:text-7xl font-display font-black uppercase italic text-white leading-none mt-4">
                AI MEAL <br /><span className="text-neon">ARCHITECT</span>
              </h1>
              <p className="text-white/40 text-sm mt-6 max-w-md leading-relaxed">
                Precision nutrition tailored for elite performance. Input your parameters to generate a biological blueprint for maximum results.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-8 bg-luxury-gray p-8 border border-white/5 rounded-xl">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                  <Target className="w-3 h-3 text-neon" /> Primary Goal
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['muscle gain', 'fat loss', 'performance', 'longevity'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={`py-3 px-4 text-[10px] font-black uppercase tracking-widest border transition-all rounded ${
                        goal === g ? 'bg-neon text-black border-neon' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                  <Apple className="w-3 h-3 text-neon" /> Dietary Restrictions
                </label>
                <input 
                  type="text"
                  placeholder="e.g., Vegan, Keto, No Dairy, Nut Allergy"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-xs placeholder:text-white/10 focus:border-neon outline-none transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                  <Scale className="w-3 h-3 text-neon" /> Calorie Target: {calories} kcal
                </label>
                <input 
                  type="range"
                  min="1200"
                  max="5000"
                  step="50"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full accent-neon h-2 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full sleek-btn-primary h-14 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating Protocols...
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4" />
                    Initialize Meal Plan
                  </>
                )}
              </Button>
            </form>

            {/* Previous Plans Rail */}
            <div className="pt-8 border-t border-white/5">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                Recent Bio-Architectural Blueprints
                {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              
              <AnimatePresence>
                {showHistory && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-6 space-y-4"
                  >
                    {savedPlans.length > 0 ? savedPlans.map((plan) => (
                      <div key={plan.id} className="p-4 bg-white/5 luxury-border flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-all">
                        <div>
                          <span className="block text-[8px] font-black uppercase text-neon">{new Date(plan.date).toLocaleDateString()}</span>
                          <span className="text-xs font-bold text-white uppercase tracking-tight">{plan.goal} • {plan.calories} kcal</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setGeneratedPlan(plan)}
                          className="opacity-0 group-hover:opacity-100 text-[9px] font-black text-neon hover:text-white"
                        >
                          OPEN
                        </Button>
                      </div>
                    )) : (
                      <p className="text-[10px] text-white/20 italic font-medium">No archived protocols found in secure storage.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Result Display */}
          <div className="relative">
            <div className="lg:sticky lg:top-32 h-full min-h-[500px] border border-white/5 rounded-2xl bg-luxury-gray overflow-hidden overflow-y-auto custom-scrollbar p-10">
              <AnimatePresence>
                {generatedPlan ? (
                  <motion.div 
                    key="display-result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="space-y-10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                         <span className="text-neon text-[10px] font-black uppercase tracking-widest italic leading-none">Active Protocol</span>
                         <h2 className="text-4xl font-display font-black text-white italic uppercase mt-2">Daily Fuel</h2>
                      </div>
                      <Button 
                        onClick={saveToFirebase}
                        className="bg-white/10 hover:bg-neon hover:text-black border border-white/5 transition-all text-[10px] font-black uppercase p-4 h-auto flex gap-2"
                      >
                        <Save className="w-3 h-3" /> ARCHIVE
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {generatedPlan.meals.map((meal, idx) => (
                        <div key={idx} className="p-6 bg-black luxury-border group hover:border-neon transition-all">
                           <div className="flex justify-between items-start mb-4">
                              <span className="text-[9px] font-black uppercase tracking-widest text-neon italic">{meal.type}</span>
                              <span className="text-[10px] font-bold text-white/40">{meal.calories} KCAL</span>
                           </div>
                           <p className="text-xs font-medium text-white/70 leading-relaxed group-hover:text-white transition-colors">
                              {meal.description}
                           </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-8 bg-black/40 border-t-2 border-neon/30 mt-10">
                       <span className="block text-[8px] font-black uppercase text-white/30 tracking-widest mb-3 italic">Architect's Summary</span>
                       <div className="flex justify-between items-end">
                          <div className="text-4xl font-display font-black text-neon italic uppercase">
                            {generatedPlan.totalCalories} <span className="text-sm">Total Kcal</span>
                          </div>
                       </div>
                       {generatedPlan.dietaryNote && (
                         <p className="mt-4 text-[10px] font-medium text-white/40 italic leading-relaxed">
                           NOTE: {generatedPlan.dietaryNote}
                         </p>
                       )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="display-idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30"
                  >
                    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black uppercase italic text-white">System Idle</h3>
                      <p className="text-xs font-medium max-w-xs mt-2">Configure biometric parameters on the left to initialize nutrition generation.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlanner;
