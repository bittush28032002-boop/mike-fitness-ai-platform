import React from 'react';
import Navbar from '../components/Navbar';
import Transformations from '../components/Transformations';
import Footer from '../components/Footer';

const TransformationsPage = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-32">
        <Transformations />
      </div>
      <Footer />
    </div>
  );
};

export default TransformationsPage;
