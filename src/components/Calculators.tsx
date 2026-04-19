import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Calculators = () => {
  // BMI State
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // Calorie State
  const [calAge, setCalAge] = useState('');
  const [calWeight, setCalWeight] = useState('');
  const [calHeight, setCalHeight] = useState('');
  const [calGender, setCalGender] = useState('male');
  const [calActivity, setCalActivity] = useState('1.2');
  const [calResult, setCalResult] = useState<number | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(bmiHeight) / 100;
    const w = parseFloat(bmiWeight);
    if (h && w) {
      setBmiResult(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  const calculateCalories = () => {
    const w = parseFloat(calWeight);
    const h = parseFloat(calHeight);
    const a = parseFloat(calAge);
    const activityMap: Record<string, number> = {
      '1.2': 1.2,
      '1.375': 1.375,
      '1.55': 1.55,
      '1.725': 1.725,
      '1.9': 1.9,
    };

    if (w && h && a) {
      let bmr = 0;
      if (calGender === 'male') {
        bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
      } else {
        bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
      }
      setCalResult(Math.round(bmr * activityMap[calActivity]));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <Calculator className="w-12 h-12 text-neon mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase italic italic text-white">
            Data-Driven <span className="text-neon">Insights</span>
          </h2>
          <p className="text-white/50 font-medium">Quickly assess your current status using our clinical-grade calculators.</p>
        </div>

        <Tabs defaultValue="bmi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-luxury-gray luxury-border h-14 p-1">
            <TabsTrigger value="bmi" className="data-[state=active]:bg-neon data-[state=active]:text-black font-bold uppercase tracking-widest text-[10px]">BMI Calculator</TabsTrigger>
            <TabsTrigger value="calories" className="data-[state=active]:bg-neon data-[state=active]:text-black font-bold uppercase tracking-widest text-[10px]">Macro Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="bmi" className="mt-8">
            <div className="bg-luxury-gray p-8 luxury-border space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="uppercase font-bold tracking-widest text-[10px] text-white/50">Height (cm)</Label>
                  <Input 
                    type="number" 
                    value={bmiHeight} 
                    onChange={(e) => setBmiHeight(e.target.value)}
                    className="bg-black border-white/10 text-white h-12" 
                    placeholder="180" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-bold tracking-widest text-[10px] text-white/50">Weight (kg)</Label>
                  <Input 
                    type="number" 
                    value={bmiWeight} 
                    onChange={(e) => setBmiWeight(e.target.value)}
                    className="bg-black border-white/10 text-white h-12" 
                    placeholder="80" 
                  />
                </div>
              </div>
              <Button onClick={calculateBMI} className="w-full bg-neon text-black font-black uppercase tracking-widest transition-all">
                Calculate BMI
              </Button>

              {bmiResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pt-6 border-t border-white/10 text-center"
                >
                  <div className="text-sm font-bold uppercase text-white/50 mb-1">Your BMI is</div>
                  <div className="text-7xl font-display font-black text-neon leading-none italic">{bmiResult}</div>
                  <div className="text-xl font-bold uppercase text-white mt-4 italic">{getBMICategory(bmiResult)}</div>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calories" className="mt-8">
            <div className="bg-luxury-gray p-8 luxury-border space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="uppercase font-bold tracking-widest text-[10px] text-white/50">Age</Label>
                  <Input 
                    type="number" 
                    value={calAge}
                    onChange={(e) => setCalAge(e.target.value)}
                    className="bg-black border-white/10 text-white h-12" 
                    placeholder="25" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-bold tracking-widest text-[10px] text-white/50">Height (cm)</Label>
                  <Input 
                    type="number" 
                    value={calHeight}
                    onChange={(e) => setCalHeight(e.target.value)}
                    className="bg-black border-white/10 text-white h-12" 
                    placeholder="180" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-bold tracking-widest text-[10px] text-white/50">Weight (kg)</Label>
                  <Input 
                    type="number" 
                    value={calWeight}
                    onChange={(e) => setCalWeight(e.target.value)}
                    className="bg-black border-white/10 text-white h-12" 
                    placeholder="80" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="uppercase font-bold tracking-widest text-[10px] text-white/50">Gender</Label>
                  <select 
                    value={calGender}
                    onChange={(e) => setCalGender(e.target.value)}
                    className="w-full h-12 bg-black border border-white/10 text-white px-4 text-sm focus:outline-none focus:border-neon"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase font-bold tracking-widest text-[10px] text-white/50">Activity Level</Label>
                  <select 
                    value={calActivity}
                    onChange={(e) => setCalActivity(e.target.value)}
                    className="w-full h-12 bg-black border border-white/10 text-white px-4 text-sm focus:outline-none focus:border-neon"
                  >
                    <option value="1.2">Sedentary (Office job)</option>
                    <option value="1.375">Light Activity (1-3 days/week)</option>
                    <option value="1.55">Moderate Activity (3-5 days/week)</option>
                    <option value="1.725">Very Active (6-7 days/week)</option>
                    <option value="1.9">Extra Active (Elite Athlete)</option>
                  </select>
                </div>
              </div>

              <Button onClick={calculateCalories} className="w-full bg-neon text-black font-black uppercase tracking-widest transition-all">
                Calculate TDEE
              </Button>

              {calResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pt-6 border-t border-white/10 text-center"
                >
                  <div className="text-sm font-bold uppercase text-white/50 mb-1">Maintenance Calories</div>
                  <div className="text-7xl font-display font-black text-neon leading-none italic">{calResult}</div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-white/5 luxury-border">
                      <span className="block text-[10px] font-bold uppercase text-white/40 mb-1 tracking-widest">Weight Loss</span>
                      <span className="text-2xl font-display font-bold text-white uppercase italic">{Math.round(calResult * 0.8)} kcal</span>
                    </div>
                    <div className="p-4 bg-white/5 luxury-border">
                      <span className="block text-[10px] font-bold uppercase text-white/40 mb-1 tracking-widest">Muscle Gain</span>
                      <span className="text-2xl font-display font-bold text-white uppercase italic">{Math.round(calResult * 1.15)} kcal</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Calculators;
