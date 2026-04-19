import React from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-32">
        <About />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
