"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = searchParams.get('email');
    const signupSuccess = searchParams.get('signupSuccess');

    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
    if (signupSuccess) {
      setSuccess('Your account has been created. Please check your email and verify your address before logging in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (data.session) {
        router.push('/');
      } else {
        setError('Check your email and confirm your account before logging in.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: false, // In Next.js, redirecting usually preferred
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign in');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl w-full space-y-10 bg-neutral p-12 md:p-16 rounded-[4rem] border border-secondary/10 shadow-2xl relative z-10 group"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="text-center space-y-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group/logo">
          <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-2xl group-hover/logo:scale-110 transition-transform duration-500">
            <Zap className="w-8 h-8 text-neutral" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-secondary uppercase">OmniAdapts</span>
        </Link>
        <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">Welcome Back</h2>
        <p className="text-lg text-secondary/60 font-medium">Log in to your account to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-6">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full pl-14 pr-6 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-6">
              <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Password</label>
              <Link href="#" className="text-[10px] font-black text-secondary/60 hover:text-secondary uppercase tracking-[0.1em]">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-xs font-bold text-center">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-secondary text-neutral rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-secondary/90 transition-all shadow-2xl shadow-secondary/20 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="relative py-6 z-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-secondary/10"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
          <span className="bg-neutral px-4 text-secondary/40 font-black">Or continue with</span>
        </div>
      </div>

      <div className="relative z-10">
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-4 border border-secondary/10 rounded-full hover:bg-secondary/5 transition-all text-[10px] font-black text-secondary uppercase tracking-[0.1em]"
        >
          <Chrome className="w-4 h-4" />
          Google
        </button>
      </div>

      <p className="text-center text-sm text-secondary/60 font-medium relative z-10">
        Don't have an account?{' '}
        <Link href="/signup" className="font-black text-secondary hover:underline uppercase text-xs tracking-tight">Sign up for free</Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
