import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image/Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
          alt="Gym" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-10 text-left w-full h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="location text-neon text-sm font-bold uppercase tracking-[2px] mb-4">
            Available in Los Angeles / Worldwide
          </div>

          <h1 className="sleek-hero-text text-white mb-6">
            Transform<br />
            Your Body<br />
            <span className="text-neon">with Mike.</span>
          </h1>

          <p className="max-w-lg text-muted-foreground text-lg font-medium leading-[1.6] mb-10">
            Certified trainer in LA with 10+ years of elite experience. Specializing in fat loss, muscle building, and holistic high-performance habits for professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/programs">
              <button className="sleek-btn-primary h-14 px-10 cursor-pointer">
                Start Training
              </button>
            </Link>
            <Link to="/programs">
              <Button size="lg" variant="outline" className="border-border text-white hover:bg-white/5 h-14 px-10 text-xs font-bold uppercase tracking-widest cursor-pointer">
                View Plans
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="flex flex-col space-y-2 opacity-30">
          <div className="h-px w-40 bg-white" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">
            01 / Professional Coaching
          </span>
        </div>
      </div>

      <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block">
        <div className="writing-mode-vertical rotate-180 flex items-center space-x-2 opacity-30">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white whitespace-nowrap">
            Scroll to explore
          </span>
          <div className="w-px h-20 bg-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
