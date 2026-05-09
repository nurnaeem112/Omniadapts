"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PricingModal from '@/components/PricingModal';
import ScrollToTop from '@/components/ScrollToTop';

// Key stored in sessionStorage once the pricing modal has been shown
// (cleared when the tab closes, so it won't persist across new sessions)
const PRICING_SHOWN_KEY = 'omniadapts_pricing_shown';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    const maybeShowPricing = (userId: string, hasPlan: boolean) => {
      if (!mounted) return;
      if (hasPlan) return; // user already has a plan — never show

      // Use a per-user key so different users on the same device don't interfere
      const shownKey = `${PRICING_SHOWN_KEY}_${userId}`;
      if (sessionStorage.getItem(shownKey)) return; // already shown this session

      // Mark as shown BEFORE opening, to prevent any race condition double-show
      sessionStorage.setItem(shownKey, '1');
      setShowPricingModal(true);
    };

    // Check current user on mount
    const checkCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email_confirmed_at) {
        maybeShowPricing(user.id, !!user.user_metadata?.plan);
      }
    };

    checkCurrentUser();

    // Listen for auth state changes — but ONLY react to the very first
    // SIGNED_IN event that follows an EMAIL_CONFIRMED (i.e. new sign-ups).
    // Regular logins from an existing session also fire SIGNED_IN, so we
    // guard with the sessionStorage key above.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        const user = session.user;
        if (user.email_confirmed_at) {
          maybeShowPricing(user.id, !!user.user_metadata?.plan);
        }
      }
    });

    return () => {
      mounted = false;
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
