import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, DollarSign, Wallet, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface PaymentGatewaysProps {
  planName: string;
  price: number;
  onSuccess?: () => void;
}

const PaymentGateways: React.FC<PaymentGatewaysProps> = ({ planName, price, onSuccess }) => {
  const [selected, setSelected] = useState<string>('stripe');
  const [processing, setProcessing] = useState(false);

  const gateways = [
    { id: 'stripe', name: 'Credit Card', icon: CreditCard, color: 'hover:border-purple-500' },
    { id: 'razorpay', name: 'UPI / NetBanking', icon: DollarSign, color: 'hover:border-blue-500' },
    { id: 'paypal', name: 'PayPal', icon: Wallet, color: 'hover:border-yellow-500' },
  ];

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setProcessing(false);
      toast.success(`${planName} Protocol Activated!`, {
        description: `Successfully paid $${price} via ${selected.toUpperCase()}.`,
      });
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-xl font-display font-black uppercase italic italic text-white leading-tight">Payment Protocol</h4>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Select Gateway</span>
        <div className="grid grid-cols-1 gap-2">
          {gateways.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className={`flex items-center justify-between p-3.5 bg-white/5 border transition-all rounded-lg ${
                selected === g.id 
                  ? 'border-neon bg-neon/5' 
                  : `border-white/10 ${g.color}`
              }`}
            >
              <div className="flex items-center gap-3">
                <g.icon className={`w-4 h-4 ${selected === g.id ? 'text-neon' : 'text-white/40'}`} />
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${selected === g.id ? 'text-white' : 'text-white/40'}`}>
                  {g.name}
                </span>
              </div>
              {selected === g.id && <Check className="w-4 h-4 text-neon" />}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="block text-[8px] font-black uppercase tracking-widest text-white/30 italic">Total Amount</span>
            <span className="text-3xl font-display font-black text-white italic leading-none">${price}</span>
          </div>
          <div className="text-right">
             <span className="block text-[8px] font-black uppercase tracking-widest text-white/30 italic">Selected</span>
             <span className="text-[10px] font-bold text-neon uppercase italic">{selected}</span>
          </div>
        </div>
        <Button 
          disabled={processing}
          onClick={handlePayment}
          className="w-full bg-neon text-black hover:bg-white h-12 font-black uppercase tracking-widest transition-all text-xs"
        >
          {processing ? "SECURELY PROCESSING..." : `CONFIRM & PAY WITH ${selected.toUpperCase()}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentGateways;
