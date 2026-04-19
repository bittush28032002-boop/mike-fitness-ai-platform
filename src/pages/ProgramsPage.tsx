import React from 'react';
import Navbar from '../components/Navbar';
import Programs from '../components/Programs';
import Footer from '../components/Footer';

const ProgramsPage = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-32">
        <Programs />
      </div>
      <Footer />
    </div>
  );
};

export default ProgramsPage;
