"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PricingModal from '@/components/PricingModal';
import ScrollToTop from '@/components/ScrollToTop';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    // Check if user just verified their email
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email_confirmed_at) {
        // If user is verified but has no plan selected in metadata
        if (!user.user_metadata?.plan) {
          setShowPricingModal(true);
        }
      }
    };

    checkVerification();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user?.email_confirmed_at && !session.user.user_metadata?.plan) {
          setShowPricingModal(true);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      {children}
      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </>
  );
}
