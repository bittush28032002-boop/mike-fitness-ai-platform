import React from 'react';
import Navbar from '../components/Navbar';
import Blog from '../components/Blog';
import Footer from '../components/Footer';

const BlogPage = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-32">
        <Blog />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
