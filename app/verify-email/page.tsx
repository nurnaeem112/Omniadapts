"use client";

import { Mail, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-10 bg-neutral p-12 md:p-16 rounded-[4rem] border border-secondary/10 shadow-2xl relative z-10 group text-center"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
        
        <div className="space-y-6 relative z-10">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-secondary" />
          </div>
          
          <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">Check your email</h2>
          <p className="text-lg text-secondary/60 font-medium leading-relaxed">
            We've sent a verification link to your email address. <br />
            Please click the link to verify your account and continue.
          </p>
        </div>

        <div className="space-y-6 relative z-10 pt-8">
          <p className="text-sm text-secondary/40 font-medium">
            Didn't receive the email? Check your spam folder or try signing up again.
          </p>
          
          <Link
            href="/login"
            className="inline-flex items-center gap-3 text-secondary font-black uppercase text-xs tracking-[0.2em] hover:gap-5 transition-all"
          >
            Back to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20">
          <Zap className="w-6 h-6 text-secondary" />
        </div>
      </motion.div>
    </div>
  );
}
