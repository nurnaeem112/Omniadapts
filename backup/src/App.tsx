import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FAQPage from './pages/FAQPage';
import BlogPage from './pages/BlogPage';
import ProfilePage from './pages/ProfilePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProtectedRoute from './components/ProtectedRoute';
import PricingModal from './components/PricingModal';
import { supabase } from './supabaseClient';

export default function App() {
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

    // Listen for auth changes (like when they click the verification link)
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
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-primary flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-[1200px] mx-auto w-full px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tool" element={
              <ProtectedRoute>
                <ToolPage />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        
        <PricingModal 
          isOpen={showPricingModal} 
          onClose={() => setShowPricingModal(false)} 
        />
      </div>
    </Router>
  );
}
