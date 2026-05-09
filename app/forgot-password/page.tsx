"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-10 bg-neutral p-12 md:p-16 rounded-[4rem] border border-secondary/10 shadow-2xl relative z-10 group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />

        {/* Header */}
        <div className="text-center space-y-4 relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group/logo">
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-2xl group-hover/logo:scale-110 transition-transform duration-500">
              <Zap className="w-8 h-8 text-neutral" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-secondary uppercase">OmniAdapts</span>
          </Link>
          <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">Forgot Password</h2>
          <p className="text-lg text-secondary/60 font-medium">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            /* ── Success State ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 flex flex-col items-center gap-6 text-center"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <p className="text-secondary font-black text-lg uppercase tracking-tight">Check Your Inbox</p>
                <p className="text-secondary/60 text-sm font-medium leading-relaxed">
                  We sent a password reset link to <br />
                  <span className="text-secondary font-black">{email}</span>
                </p>
                <p className="text-secondary/40 text-xs font-medium mt-2">
                  Didn't receive it? Check your spam folder or try again.
                </p>
              </div>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-xs font-black text-secondary/60 hover:text-secondary uppercase tracking-[0.15em] underline underline-offset-4 transition-colors"
              >
                Try a different email
              </button>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-black text-secondary/60 hover:text-secondary uppercase tracking-[0.15em] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Login
              </Link>
            </motion.div>
          ) : (
            /* ── Form State ── */
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8 relative z-10"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-6">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-14 pr-6 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                  />
                </div>
              </div>

              {error && (
                <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-secondary text-neutral rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-secondary/90 transition-all shadow-2xl shadow-secondary/20 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-xs font-black text-secondary/60 hover:text-secondary uppercase tracking-[0.15em] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Login
              </Link>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
