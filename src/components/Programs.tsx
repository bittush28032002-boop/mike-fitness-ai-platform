import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { TRAINING_PLANS } from '@/constants';
import TrainingPlanDialog from './TrainingPlanDialog';

const Programs = () => {
  return (
    <section className="py-24 bg-black" id="programs">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">
            Elite Training Protocols
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-black leading-none tracking-tighter uppercase italic">
            Select Your <span className="text-neon">Program</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/50 font-medium">
            Whether you're looking to shred fat, build peak mass, or need premium coaching from anywhere, we have a protocol designed for your goals.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {TRAINING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TrainingPlanDialog plan={plan}>
                <button className="sleek-program-card group w-full text-left">
                  <div className="flex flex-col text-left">
                    <h4 className="text-xl font-display font-black uppercase italic text-white group-hover:text-neon transition-colors">
                      {plan.name}
                    </h4>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 font-bold">
                      {plan.features.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Total Investment</span>
                      <div className="text-3xl font-display font-black text-neon italic">${plan.price}</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white/20 group-hover:text-neon group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </TrainingPlanDialog>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;

