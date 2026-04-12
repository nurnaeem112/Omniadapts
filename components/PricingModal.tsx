"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Sparkles, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PRICING_PLANS } from '@/constants/pricing';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();

  const handleSelect = async (plan: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/signup');
        return;
      }

      if (plan.id === 'free') {
        await supabase.auth.updateUser({
          data: { plan: plan.name }
        });
        onClose();
        router.push('/');
        return;
      }

      if (!plan.polarProductId) {
        console.error('No Polar Product ID for this plan');
        return;
      }

      console.log('Initiating checkout for plan:', plan.name, 'with product ID:', plan.polarProductId);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: plan.polarProductId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Checkout response:', data);
      
      if (data.url) {
        // Open in new tab to avoid iframe restrictions
        window.open(data.url, '_blank');
        onClose();
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error selecting plan:', err);
      alert('Failed to initiate checkout. Please try again.');
    }
  };

  const handleCancel = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !user.user_metadata?.plan) {
        await supabase.auth.updateUser({
          data: { plan: 'Free' }
        });
      }
    } catch (err) {
      console.error('Error setting default plan:', err);
    }
    onClose();
    router.push('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="absolute inset-0 bg-secondary/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-neutral rounded-[3rem] border border-secondary/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            {/* Header */}
            <div className="p-8 md:p-12 text-center relative z-10 border-b border-secondary/5">
              <button 
                onClick={handleCancel}
                className="absolute top-8 right-8 p-2 hover:bg-secondary/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-secondary/40" />
              </button>
              
              <h2 className="text-3xl md:text-5xl font-black text-secondary tracking-tighter uppercase mb-4">
                Welcome to <span className="text-secondary/40">OmniAdapts</span>
              </h2>
              <p className="text-secondary/60 font-medium max-w-xl mx-auto">
                Your account is ready! Choose a plan to unlock the full power of platform-optimized content.
              </p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 overflow-y-auto scrollbar-hide relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className={cn(
                      "relative p-8 rounded-[2.5rem] border flex flex-col transition-all group",
                      plan.popular 
                        ? "bg-neutral border-secondary border-2 text-secondary shadow-xl" 
                        : "bg-neutral border-secondary/10 text-secondary hover:border-secondary/30"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-secondary text-neutral rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-secondary">
                        Recommended
                      </div>
                    )}

                    {plan.badge && !plan.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-secondary/10 text-secondary rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-secondary/20">
                        {plan.badge}
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-black mb-2 tracking-tight uppercase">{plan.name}</h3>
                      <p className="text-secondary/60 text-xs font-medium leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6 flex items-baseline gap-2">
                      <span className="text-4xl font-black text-secondary tracking-tighter">${plan.price}</span>
                      <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">/{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-xs font-medium">
                          <div className="w-4 h-4 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-secondary" />
                          </div>
                          <span className="text-secondary/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelect(plan)}
                      className={cn(
                        "w-full py-4 rounded-full font-black text-center transition-all uppercase tracking-[0.2em] text-[10px]",
                        plan.popular
                          ? "bg-secondary text-neutral hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                          : "bg-secondary/5 text-secondary hover:bg-secondary/10"
                      )}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-secondary/5 text-center relative z-10">
              <button 
                onClick={handleCancel}
                className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] hover:text-secondary transition-colors"
              >
                Skip for now and go to home
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
