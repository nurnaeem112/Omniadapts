"use client";

import { Check, Zap, Sparkles, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PRICING_PLANS } from '@/constants/pricing';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PricingPage() {
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
        let errorMsg = `Server responded with ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMsg = errorData.error || errorData.details || errorMsg;
          } else {
            errorMsg = await response.text();
          }
        } catch (e) {
          console.error("Failed to parse error response", e);
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('Checkout response:', data);
      
      if (data.url) {
        // Redirect in same tab to avoid popup blockers
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error selecting plan:', err);
      alert('Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div className="flex flex-col py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 w-full space-y-32 relative z-10">
        {/* Header */}
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-[0.2em]"
          >
            Pricing Plans
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-secondary leading-[0.9]"
          >
            Simple, Transparent <br />
            <span className="text-secondary/40">Pricing.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-secondary/60 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Choose the plan that's right for your content strategy. No hidden fees, cancel anytime.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={cn(
                "relative p-12 rounded-[3.5rem] border flex flex-col h-full transition-all group",
                plan.popular 
                  ? "bg-neutral border-secondary border-2 text-secondary shadow-2xl scale-105 z-10" 
                  : "bg-neutral border-secondary/10 text-secondary hover:border-secondary/30"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-secondary text-neutral rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-secondary shadow-xl">
                  Most Popular
                </div>
              )}

              {plan.badge && !plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-secondary/20 shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-2xl font-black mb-3 tracking-tight uppercase">{plan.name}</h3>
                <p className="text-secondary/60 text-sm font-medium leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-6xl font-black text-secondary tracking-tighter">${plan.price}</span>
                <span className="text-xs font-black text-secondary/40 uppercase tracking-widest">/{plan.period}</span>
              </div>

              <div className="h-px bg-secondary/10 w-full mb-10" />

              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-secondary/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-secondary/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(plan)}
                className={cn(
                  "w-full py-6 rounded-full font-black text-center transition-all uppercase tracking-[0.2em] text-xs shadow-lg",
                  plan.popular
                    ? "bg-secondary text-neutral hover:bg-secondary/90 shadow-secondary/20"
                    : "bg-secondary/5 text-secondary hover:bg-secondary/10"
                )}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Preview */}
        <div className="bg-neutral rounded-[4rem] p-16 border border-secondary/10 text-center space-y-16 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="space-y-6 relative z-10">
            <h2 className="text-4xl font-black text-secondary tracking-tighter">Frequently Asked Questions</h2>
            <p className="text-secondary/60 max-w-xl mx-auto text-lg font-medium">
              Everything you need to know about OmniAdapt's pricing and billing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-5xl mx-auto relative z-10">
            <div className="space-y-4">
              <h4 className="text-lg font-black text-secondary tracking-tight uppercase">Can I change plans later?</h4>
              <p className="text-secondary/60 leading-relaxed font-medium">Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes are applied immediately.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-black text-secondary tracking-tight uppercase">Is there a free trial?</h4>
              <p className="text-secondary/60 leading-relaxed font-medium">Our Pro plan comes with a 7-day free trial so you can test all the premium features before committing.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-black text-secondary tracking-tight uppercase">What is custom website context?</h4>
              <p className="text-secondary/60 leading-relaxed font-medium">It allows the AI to analyze specific URLs to match their tone, style, and content structure perfectly for your generated copy.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-black text-secondary tracking-tight uppercase">Do you offer discounts for non-profits?</h4>
              <p className="text-secondary/60 leading-relaxed font-medium">Yes! Contact our sales team for special non-profit and educational pricing tailored to your organization's needs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
