"use client";

import { Mail, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const EMAIL = 'omniadapts@gmail.com';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };


  return (
    <div className="flex flex-col min-h-screen py-24 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      {/* Ambient glows */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--color-secondary-rgb, 100,100,200),0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--color-secondary-rgb, 100,100,200),0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 w-full relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-[0.2em]"
          >
            <Mail className="w-3 h-3" />
            Get In Touch
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-secondary leading-[0.9]"
          >
            Let&apos;s{' '}
            <span className="text-secondary/30">Connect.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-secondary/60 leading-relaxed font-medium max-w-xl mx-auto"
          >
            Have questions about OmniAdapts? Want to partner with us? Or just want to say hello?
            We&apos;d love to hear from you.
          </motion.p>
        </div>

        {/* Email Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="bg-neutral rounded-[3rem] border border-secondary/10 p-12 md:p-16 shadow-sm overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/3 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-secondary/5 border border-secondary/10 flex items-center justify-center group-hover:bg-secondary/10 transition-colors duration-500">
                <Mail className="w-9 h-9 text-secondary/70" />
              </div>

              {/* Label */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.3em]">
                  Email Address
                </p>
                <p className="text-3xl md:text-4xl font-black text-secondary tracking-tight">
                  {EMAIL}
                </p>
              </div>

              {/* Divider */}
              <div className="w-24 h-px bg-secondary/10" />

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2.5 px-10 py-4 rounded-full border border-secondary/15 bg-secondary/5 text-secondary font-black uppercase text-[11px] tracking-[0.2em] hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-300 group/btn"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                    Copy Email
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-secondary/30 text-sm font-medium mt-12"
        >
          We typically respond within 24&nbsp;hours.
        </motion.p>
      </div>
    </div>
  );
}
