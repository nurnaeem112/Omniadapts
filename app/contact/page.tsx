"use client";

import { Mail, MessageSquare, Globe, Send, CheckCircle2, MapPin, Phone, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_tn0eo0y';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!templateId || !publicKey) {
        throw new Error('EmailJS template ID or public key is missing. Please configure them in the environment variables.');
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'omniadapts@gmail.com'
        },
        publicKey
      );

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('EmailJS Error:', err);
      setError(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left Side: Info */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-[0.2em]"
              >
                Contact Us
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black tracking-tighter text-secondary leading-[0.9]"
              >
                Let's <br />
                <span className="text-secondary/40">Connect.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-secondary/60 leading-relaxed font-medium max-w-md"
              >
                Have questions about OmniAdapt? Want to partner with us? Or just want to say hello? We'd love to hear from you.
              </motion.p>
            </div>

            <div className="space-y-10">
              {[
                { icon: Mail, title: 'Email', value: 'omniadapts@gmail.com' }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-secondary/5 rounded-full flex items-center justify-center shrink-0 border border-secondary/10 group-hover:bg-secondary group-hover:border-secondary transition-colors duration-500">
                    <item.icon className="w-8 h-8 text-secondary group-hover:text-neutral transition-colors duration-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-secondary tracking-tight uppercase">{item.title}</h3>
                    <p className="text-secondary/60 font-medium text-lg">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral rounded-[4rem] border border-secondary/10 p-12 md:p-16 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                {isSubmitted ? (
                  <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">Message Sent!</h2>
                    <p className="text-secondary/60 max-w-xs text-lg font-medium">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-8 px-10 py-4 bg-secondary text-neutral rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-4">Full Name</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-6 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-4">Email Address</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-6 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-4">Subject</label>
                      <input
                        required
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="w-full px-6 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] ml-4">Message</label>
                        <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full px-6 py-5 bg-neutral border border-secondary/10 rounded-[2.5rem] focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20 h-48 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-5 bg-secondary text-neutral rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-secondary/90 transition-all shadow-2xl shadow-secondary/20 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      )}
                      {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
