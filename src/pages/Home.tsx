import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Programs from '../components/Programs';
import Transformations from '../components/Transformations';
import Blog from '../components/Blog';
import Calculators from '../components/Calculators';
import Booking from '../components/Booking';
import Footer from '../components/Footer';
import { motion, useScroll, useSpring } from 'motion/react';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-neon origin-left z-[60]" style={{ scaleX }} />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Transformations />
        <Calculators />
        <Blog />
        <Booking />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

