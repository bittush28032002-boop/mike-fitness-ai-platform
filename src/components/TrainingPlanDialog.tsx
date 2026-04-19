import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { Button } from './ui/button';
import { TrainingPlan } from '../types';
import PaymentGateways from './PaymentGateways';
import { Check, LogIn } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { signInWithGoogle } from '../lib/firebase';

interface TrainingPlanDialogProps {
  plan: TrainingPlan;
  children: React.ReactNode;
}

const TrainingPlanDialog: React.FC<TrainingPlanDialogProps> = ({ plan, children }) => {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const { user } = useAuth();

  return (
    <Dialog onOpenChange={() => setStep('details')}>
      <DialogTrigger render={children} />
      <DialogContent className="bg-luxury-gray border-white/10 max-w-2xl text-white p-0 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-0">
          {/* Summary Sidebar */}
          <div className="bg-black p-8 md:p-10 space-y-8 border-b md:border-b-0 md:border-r border-white/5">
            <div>
              <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">Checkout</span>
              <h3 className="text-3xl font-display font-black uppercase italic italic text-white leading-tight mt-2">{plan.name}</h3>
              <p className="text-white/40 text-xs font-medium mt-4 leading-relaxed">
                {plan.description || "Elite performance protocol tailored for maximum efficiency and results."}
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Key Features</span>
              <ul className="space-y-3">
                {plan.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-3 text-xs font-medium text-white/70">
                    <Check className="w-3 h-3 text-neon" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
               <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Total Investment</span>
               <div className="text-5xl font-display font-black text-neon mt-2 italic">${plan.price}</div>
               <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{plan.duration} Protocol</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-8 md:p-10 bg-luxury-gray">
            {step === 'details' ? (
              <div className="flex flex-col h-full">
                <div className="flex-grow space-y-5">
                  <h4 className="text-xl font-display font-black uppercase italic italic text-white leading-tight">Enrollment Confirmation</h4>
                  {user ? (
                    <p className="text-white/60 text-sm leading-relaxed">
                      Logged in as <span className="text-neon font-bold">{user.displayName}</span>. By proceeding, you agree to commit to the {plan.duration} curriculum.
                    </p>
                  ) : (
                    <p className="text-white/60 text-sm leading-relaxed">
                      You must be logged in to claim this protocol and track your progression.
                    </p>
                  )}
                  
                  <div className="space-y-4">
                     <div className="p-4 bg-white/5 luxury-border">
                        <span className="block text-[8px] font-black tracking-widest uppercase text-white/40">Expected Results</span>
                        <span className="text-xs font-bold text-white mt-1">High-Impact Body Transformation</span>
                     </div>
                     <div className="p-4 bg-white/5 luxury-border">
                        <span className="block text-[8px] font-black tracking-widest uppercase text-white/40">Support Level</span>
                        <span className="text-xs font-bold text-white mt-1">Direct Technical Support</span>
                     </div>
                  </div>
                </div>
                
                {user ? (
                  <Button 
                    onClick={() => setStep('payment')}
                    className="w-full bg-neon text-black hover:bg-white h-14 font-black uppercase tracking-widest mt-6"
                  >
                     Proceed to Payment
                  </Button>
                ) : (
                  <Button 
                    onClick={() => signInWithGoogle()}
                    className="w-full bg-white text-black hover:bg-neon h-14 font-black uppercase tracking-widest mt-6"
                  >
                     <LogIn className="w-4 h-4 mr-2" /> Authenticate to Join
                  </Button>
                )}
              </div>
            ) : (
              <PaymentGateways 
                planName={plan.name} 
                price={plan.price} 
                onSuccess={() => { /* Handled by Sonner toast in component */ }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingPlanDialog;
