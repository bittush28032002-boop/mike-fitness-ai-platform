import React from 'react';
import { Dumbbell, Instagram, Youtube, Twitter, Send } from 'lucide-react';
import { Button } from './ui/button';
import { BRAND_NAME, SOCIAL_LINKS } from '@/constants';

const Footer = () => {
  return (
    <footer className="footer bg-luxury-gray py-10 border-t border-border">
      <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="socials flex gap-8 text-[11px] color-text-dim uppercase tracking-[1px] font-bold text-muted-foreground">
          <a href={SOCIAL_LINKS.instagram} className="hover:text-neon transition-colors">Instagram @mikefitness</a>
          <a href={SOCIAL_LINKS.youtube} className="hover:text-neon transition-colors">YouTube /mikefit</a>
          <a href="#" className="hover:text-neon transition-colors">WhatsApp Support</a>
        </div>
        
        <div className="payment-icons flex gap-3">
          <div className="badge bg-luxury-light-gray text-white text-[10px] px-3 py-1.5 rounded font-bold uppercase tracking-wider">Stripe Secure</div>
          <div className="badge bg-luxury-light-gray text-white text-[10px] px-3 py-1.5 rounded font-bold uppercase tracking-wider">PayPal</div>
          <div className="badge bg-luxury-light-gray text-white text-[10px] px-3 py-1.5 rounded font-bold uppercase tracking-wider">Razorpay</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
