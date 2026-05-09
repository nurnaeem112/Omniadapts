"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  /* ──────────────────────────────────────────────
     Supabase embeds the token in the URL hash.
     We listen for the PASSWORD_RECOVERY event.
  ────────────────────────────────────────────── */
  useEffect(() => {
    // Check for error in URL (e.g., expired link)
    const error_description = searchParams.get('error_description');
    if (error_description) {
      setTokenValid(false);
      setError(decodeURIComponent(error_description));
      return;
    }

    // Listen for Supabase auth state: PASSWORD_RECOVERY fires when the
    // user visits the reset link and the token is valid.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setTokenValid(true);
        }
      }
    );

    // If no error param, optimistically mark as valid (token is in hash)
    setTokenValid(true);

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '20%' };
    if (pwd.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Fair', color: 'bg-yellow-500', width: '65%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Invalid / Expired Token ── */
  if (tokenValid === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-10 bg-neutral p-12 md:p-16 rounded-[4rem] border border-secondary/10 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-secondary font-black text-lg uppercase tracking-tight">Link Expired</p>
            <p className="text-secondary/60 text-sm font-medium leading-relaxed">
              This password reset link has expired or is invalid.
              <br />Please request a new one.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 py-4 px-8 bg-secondary text-neutral rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-2xl shadow-secondary/20"
          >
            Request New Link
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
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
        <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">New Password</h2>
        <p className="text-lg text-secondary/60 font-medium">
          Choose a strong, new password for your account.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          /* ── Success State ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center gap-6 text-center"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-secondary font-black text-lg uppercase tracking-tight">Password Updated!</p>
              <p className="text-secondary/60 text-sm font-medium leading-relaxed">
                Your password has been changed successfully.
                <br />Redirecting you to login...
              </p>
            </div>
            <Link
              href="/login"
              className="text-xs font-black text-secondary/60 hover:text-secondary uppercase tracking-[0.15em] underline underline-offset-4 transition-colors"
            >
              Go to Login Now
            </Link>
          </motion.div>
        ) : (
          /* ── Form State ── */
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-8 relative z-10"
          >
            <div className="space-y-6">
              {/* New Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-6">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {strength && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 space-y-1"
                  >
                    <div className="w-full h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: strength.width }}
                        className={`h-full rounded-full ${strength.color} transition-all duration-500`}
                      />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${
                      strength.label === 'Strong' ? 'text-green-500' :
                      strength.label === 'Fair' ? 'text-yellow-500' :
                      strength.label === 'Weak' ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-6">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/40" />
                  <input
                    required
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Match indicator */}
                {formData.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-[10px] font-black uppercase tracking-[0.15em] ml-6 ${
                      formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </motion.p>
                )}
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
              {loading ? 'Updating Password...' : 'Update Password'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
