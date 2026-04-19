import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Dumbbell, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { BRAND_NAME } from '@/constants';
import { useAuth } from '../lib/AuthContext';
import { signInWithGoogle, logOut } from '../lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import UserAvatar from './UserAvatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Transformations', path: '/transformations' },
    { name: 'Blog', path: '/blog' },
    { name: 'Meal Architect', path: '/meal-planner' },
  ];

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black border-b border-white/5 py-4' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="logo font-black text-xl tracking-tighter uppercase whitespace-nowrap">
            MIKE <span className="text-neon">JOHNSON</span> FITNESS
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-12">
          <div className="flex items-center space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[9px] lg:text-[10px] uppercase tracking-[2px] font-black transition-colors hover:text-white ${
                  isActive(link.path) ? 'text-neon' : 'text-white/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="h-4 w-px bg-white/10 ml-4 lg:ml-6" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center pl-4 lg:pl-6 outline-none group cursor-pointer">
                <UserAvatar user={user} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-luxury-gray border-border text-white w-56 p-2 rounded-lg">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-white">{user.displayName}</span>
                    <span className="block text-[10px] text-muted-foreground font-medium lowercase tracking-tight">{user.email}</span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="focus:bg-neon focus:text-black cursor-pointer rounded-md p-3" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem className="focus:bg-neon focus:text-black cursor-pointer rounded-md p-3" onClick={() => navigate('/admin')}>
                    <User className="w-4 h-4 mr-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Admin Control</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="focus:bg-red-500 focus:text-white cursor-pointer rounded-md p-3" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Exit Protocol</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button 
              onClick={handleLogin}
              className="sleek-btn-primary"
            >
              Member Portal
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-b border-white/10 px-6 py-8 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm uppercase tracking-widest font-bold ${
                    isActive(link.path) ? 'text-neon' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="bg-neon text-black font-bold uppercase tracking-widest text-xs w-full">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
