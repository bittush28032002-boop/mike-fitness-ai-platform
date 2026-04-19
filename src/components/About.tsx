import React from 'react';
import { motion } from 'motion/react';
import { TRAINER_NAME } from '@/constants';

const About = () => {
  return (
    <section className="py-24 bg-luxury-gray relative" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-luxury-light-gray rounded-sm overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop" 
                alt={TRAINER_NAME}
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[1rem] border-black/50 pointer-events-none" />
            </div>
            {/* Floating Banner */}
            <div className="absolute -bottom-6 -right-6 md:-right-12 bg-neon p-8 shadow-2xl">
              <span className="block text-4xl md:text-5xl font-display font-black text-black leading-none uppercase italic">
                10+ Years
              </span>
              <span className="block text-xs font-bold text-black uppercase tracking-widest mt-2">
                Of Professional Excellence
              </span>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">
                Meet Your Coach
              </span>
              <h2 className="text-5xl md:text-7xl font-display font-black leading-none tracking-tighter uppercase italic">
                The Force Behind <br />
                <span className="text-white">Your Success</span>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-white/70 leading-relaxed font-medium">
              <p>
                As a Certified Personal Trainer in Los Angeles with over a decade of hands-on experience, 
                I've dedicated my life to mastering the science of body transformation.
              </p>
              <p>
                My approach combines elite-level strength training with data-driven nutrition strategies 
                to help high-performance individuals lose fat and build lean muscle effectively.
              </p>
            </div>

            <div className="stats-row grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border">
              <div className="sleek-stat-card text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2 font-bold">Experience</span>
                <h3 className="text-3xl font-display font-black text-neon italic">10+ Yrs</h3>
              </div>
              <div className="sleek-stat-card text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2 font-bold">Clients</span>
                <h3 className="text-3xl font-display font-black text-neon italic">500+</h3>
              </div>
              <div className="sleek-stat-card text-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2 font-bold">Success Rate</span>
                <h3 className="text-3xl font-display font-black text-neon italic">98%</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
