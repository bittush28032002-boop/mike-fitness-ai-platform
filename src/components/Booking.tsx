import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BRAND_NAME, LOCATION } from '@/constants';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { toast } from 'sonner';

const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      goal: formData.get('goal') as string,
      phone: formData.get('phone') as string,
      status: 'new',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'leads'), data);
      setSuccess(true);
      toast.success("Consultation Booked!", {
        description: "Mike will review your profile and contact you shortly."
      });
    } catch (error: any) {
      handleFirestoreError(error, 'create', 'leads');
      toast.error("Booking Error", { description: "Technical failure. Please call us directly." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-luxury-gray relative overflow-hidden" id="booking">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">
              Secure Your Slot
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-black leading-none tracking-tighter uppercase italic text-white">
              Start Your <br />
              <span className="text-neon">Consultation</span>
            </h2>
            <p className="text-white/50 text-lg font-medium max-w-lg">
              We only take on 15 selective clients per quarter to ensure premium attention. Book your free intro call today.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="p-4 bg-white/5 luxury-border rounded-sm group-hover:bg-neon group-hover:text-black transition-all">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-white/40 tracking-widest">Call or WhatsApp</span>
                <span className="text-xl font-display font-bold text-white uppercase italic">+1 323 555 1234</span>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="p-4 bg-white/5 luxury-border rounded-sm group-hover:bg-neon group-hover:text-black transition-all">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-white/40 tracking-widest">Direct Email</span>
                <span className="text-xl font-display font-bold text-white uppercase italic">train@mikefitness.com</span>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="p-4 bg-white/5 luxury-border rounded-sm group-hover:bg-neon group-hover:text-black transition-all">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-white/40 tracking-widest">Premium LA Base</span>
                <span className="text-xl font-display font-bold text-white uppercase italic">{LOCATION}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {success ? (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-neon/10 border border-neon/30 text-center space-y-6">
              <div className="w-20 h-20 bg-neon rounded-full flex items-center justify-center">
                <Send className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-4xl font-display font-black text-white uppercase italic">Request Sent</h3>
              <p className="text-white/70">Mike will contact you within 24 hours to schedule your roadmap session.</p>
              <Button onClick={() => setSuccess(false)} variant="outline" className="border-border text-white">Send Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sleek-consult-box relative z-10">
              <h3 className="text-2xl font-display font-black uppercase text-black mb-6">Book Free Consultation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" required placeholder="Full Name" className="bg-black/10 border-black/20 text-black placeholder:text-black/40 h-12 focus:border-black" />
                <Input name="email" type="email" required placeholder="Email Address" className="bg-black/10 border-black/20 text-black placeholder:text-black/40 h-12 focus:border-black" />
              </div>

              <Input name="phone" required placeholder="Phone Number" className="bg-black/10 border-black/20 text-black placeholder:text-black/40 h-12 focus:border-black mt-4" />
              
              <div className="mt-4">
                <select name="goal" className="w-full bg-black/10 border border-black/20 rounded-lg px-4 h-12 text-black/70 text-sm focus:border-black focus:outline-none">
                  <option value="fat-loss">Fat Loss Protocol</option>
                  <option value="muscle-gain">Muscle Gain Elite</option>
                  <option value="strength">Strength Phase</option>
                  <option value="coaching">Digital Coaching</option>
                </select>
              </div>

              <button 
                disabled={loading} 
                className="w-full bg-black text-white hover:bg-black/80 h-14 font-black uppercase tracking-widest transition-all rounded-lg mt-6"
              >
                {loading ? "Sending..." : "Send Request"}
              </button>
            </form>
          )}

          {/* Decorative Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-neon/5 blur-[120px] -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Booking;
