import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AboutPage from './pages/About';
import ProgramsPage from './pages/ProgramsPage';
import TransformationsPage from './pages/TransformationsPage';
import BlogPage from './pages/BlogPage';
import MealPlanner from './pages/MealPlanner';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './lib/AuthContext';
import { testFirestoreConnection } from './lib/firebase';
import AIChatbot from './components/AIChatbot';

export default function App() {
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white selection:bg-neon selection:text-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/transformations" element={<TransformationsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster position="top-center" expand={false} richColors />
          <AIChatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}




