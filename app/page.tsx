"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Sparkles, 
  Target, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Linkedin, 
  Mail, 
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter (X)', iconUrl: 'https://cdn.simpleicons.org/x', color: 'text-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { id: 'instagram_feed', name: 'Instagram Feed', iconUrl: 'https://cdn.simpleicons.org/instagram', color: 'text-pink-600' },
  { id: 'instagram_stories', name: 'Instagram Stories', iconUrl: 'https://cdn.simpleicons.org/instagram', color: 'text-orange-500' },
  { id: 'tiktok', name: 'TikTok', iconUrl: 'https://cdn.simpleicons.org/tiktok', color: 'text-black' },
  { id: 'facebook', name: 'Facebook', iconUrl: 'https://cdn.simpleicons.org/facebook', color: 'text-blue-700' },
  { id: 'pinterest', name: 'Pinterest', iconUrl: 'https://cdn.simpleicons.org/pinterest', color: 'text-red-600' },
  { id: 'reddit', name: 'Reddit', iconUrl: 'https://cdn.simpleicons.org/reddit', color: 'text-orange-600' },
  { id: 'youtube', name: 'YouTube', iconUrl: 'https://cdn.simpleicons.org/youtube', color: 'text-red-600' },
  { id: 'discord_telegram', name: 'Discord/Telegram', iconUrl: 'https://cdn.simpleicons.org/discord', color: 'text-indigo-500' },
  { id: 'email', name: 'Email Newsletter', icon: Mail, color: 'text-zinc-600' },
  { id: 'quora', name: 'Quora', iconUrl: 'https://cdn.simpleicons.org/quora', color: 'text-red-700' },
];

const FAQS = [
  {
    q: "How does OmniAdapts work?",
    a: "OmniAdapts uses advanced AI to analyze your core marketing message and then intelligently adapts it for different social media platforms, considering their specific character limits, audience expectations, and cultural nuances."
  },
  {
    q: "Which platforms are supported?",
    a: "We support over 12 major platforms including Twitter (X), LinkedIn, Instagram (Feed & Stories), TikTok, Facebook, Pinterest, Reddit, YouTube, Discord, Telegram, and Email Newsletters."
  },
  {
    q: "Can I use my own website as context?",
    a: "Yes! With our Pro and Enterprise plans, you can provide URLs of your own website or blog. Our AI will analyze the existing content to ensure the generated copy matches your brand's unique voice and style."
  },
  {
    q: "Is there a limit to how many posts I can generate?",
    a: "The Starter plan allows for 5 generations per day. Our Pro and Enterprise plans offer unlimited generations, allowing you to scale your content strategy without restrictions."
  }
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-3 h-3 text-secondary" />
              AI-Powered Content Strategy
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-secondary max-w-5xl leading-[0.9]"
            >
              Create <span className="inline-block">Platform-Specific</span> <br />
              <span className="text-secondary/20">Content from One Input</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-secondary/60 max-w-2xl leading-relaxed font-medium"
            >
              OmniAdapts transforms your content into platform-optimized posts for X, LinkedIn, Reddit, and more — so you can grow everywhere without rewriting.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-6"
            >
              <Link
                href="/tool"
                className="w-full sm:w-auto px-10 py-5 bg-secondary text-neutral rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-secondary/90 transition-all shadow-2xl shadow-secondary/20 group"
              >
                Start Adapting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-10 py-5 bg-neutral text-secondary border border-secondary/10 rounded-full font-black uppercase tracking-widest text-sm hover:bg-neutral/90 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-24 bg-neutral/50 border-y border-secondary/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10 mb-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-secondary tracking-tight">Supported Platforms</h2>
            <p className="text-secondary/60 max-w-xl mx-auto font-medium">
              OmniAdapts understands the unique culture and format of every major digital channel.
            </p>
          </div>
        </div>
        
        <div className="flex overflow-hidden">
          <motion.div
            animate={{
              x: [0, -(200 + 24) * PLATFORMS.length],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-6 whitespace-nowrap"
          >
            {[...PLATFORMS, ...PLATFORMS].map((platform, index) => (
              <div
                key={`${platform.id}-${index}`}
                className="bg-primary p-8 rounded-[2.5rem] border border-secondary/10 flex flex-col items-center gap-6 shadow-sm hover:shadow-xl transition-all group w-[200px] shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center group-hover:scale-110 transition-transform p-4">
                  {platform.id === 'linkedin' || platform.id === 'email' ? (
                    platform.id === 'linkedin' ? <Linkedin className={cn("w-full h-full", platform.color)} /> : <Mail className={cn("w-full h-full", platform.color)} />
                  ) : (
                    <img 
                      src={platform.iconUrl} 
                      alt={platform.name} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <span className="text-xs font-black text-secondary uppercase tracking-widest">{platform.name.split(' ')[0]}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Bento Style */}
      <section className="py-32 bg-primary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-neutral p-12 rounded-[3rem] border border-secondary/10 space-y-6 flex flex-col justify-end min-h-[400px] relative overflow-hidden group">
              <div className="absolute top-12 right-12 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-neutral" />
              </div>
              <h3 className="text-3xl font-black text-secondary tracking-tight">Audience Focused</h3>
              <p className="text-secondary/60 leading-relaxed text-lg max-w-xl">
                We don't just copy-paste. We rewrite your message to resonate with the specific demographics of each platform, ensuring your voice is heard where it matters most.
              </p>
            </div>
            
            <div className="md:col-span-4 bg-secondary p-12 rounded-[3rem] border border-secondary space-y-6 flex flex-col justify-end min-h-[400px] text-neutral">
              <div className="w-14 h-14 bg-neutral rounded-full flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-3xl font-black tracking-tight">Instant Adaptation</h3>
              <p className="text-neutral/60 leading-relaxed text-lg">
                Save hours of manual writing. Generate high-quality, platform-specific copy in seconds.
              </p>
            </div>

            <div className="md:col-span-4 bg-neutral p-12 rounded-[3rem] border border-secondary/10 space-y-6 flex flex-col justify-end min-h-[400px]">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-neutral" />
              </div>
              <h3 className="text-3xl font-black text-secondary tracking-tight">SEO Optimized</h3>
              <p className="text-secondary/60 leading-relaxed text-lg">
                Ensure your content is discoverable with relevant keywords and tags.
              </p>
            </div>

            <div className="md:col-span-8 bg-neutral/50 p-12 rounded-[3rem] border border-secondary/10 space-y-6 flex flex-col justify-center items-center text-center min-h-[400px] border-dashed">
              <Sparkles className="w-16 h-16 text-secondary/20 mb-4" />
              <h3 className="text-3xl font-black text-secondary tracking-tight">More Features Coming Soon</h3>
              <p className="text-secondary/40 leading-relaxed text-lg max-w-md">
                We're constantly training our AI on new platforms and marketing trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section Preview */}
      <section className="py-20 bg-primary/50 border-y border-secondary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-secondary">Plans for Everyone</h2>
            <p className="text-secondary/60 max-w-xl mx-auto">
              Start for free and upgrade as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral p-8 rounded-[3rem] border border-secondary/10 space-y-6">
              <h3 className="text-xl font-bold text-secondary">Free</h3>
              <p className="text-3xl font-bold text-secondary">$0<span className="text-sm font-normal text-secondary/60">/mo</span></p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-secondary/60"><CheckCircle2 className="w-4 h-4 text-secondary" /> 10 Generations/mo</li>
                <li className="flex items-center gap-2 text-sm text-secondary/60"><CheckCircle2 className="w-4 h-4 text-secondary" /> Standard Platforms</li>
              </ul>
              <Link href="/pricing" className="block w-full py-3 bg-secondary/5 text-secondary rounded-full text-center font-bold hover:bg-secondary/10 transition-all">Learn More</Link>
            </div>
            <div className="bg-secondary p-8 rounded-[3rem] border border-secondary text-neutral space-y-6 shadow-2xl scale-105">
              <h3 className="text-xl font-bold">1 Month</h3>
              <p className="text-3xl font-bold text-neutral">$9.99<span className="text-sm font-normal text-neutral/60">/mo</span></p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-neutral/80"><CheckCircle2 className="w-4 h-4 text-neutral" /> 200 Generations/mo</li>
                <li className="flex items-center gap-2 text-sm text-neutral/80"><CheckCircle2 className="w-4 h-4 text-neutral" /> All 12+ Platforms</li>
              </ul>
              <Link href="/pricing" className="block w-full py-3 bg-neutral text-secondary rounded-full text-center font-bold hover:bg-neutral/90 transition-all">Get Started</Link>
            </div>
            <div className="bg-neutral p-8 rounded-[3rem] border border-secondary/10 space-y-6 relative">
              <div className="absolute top-4 right-8 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[8px] font-black uppercase tracking-widest border border-secondary/20">Save 30%</div>
              <h3 className="text-xl font-bold text-secondary">3 Months</h3>
              <p className="text-3xl font-bold text-secondary">$20.99<span className="text-sm font-normal text-secondary/60">/3mo</span></p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-secondary/60"><CheckCircle2 className="w-4 h-4 text-secondary" /> 200 Generations/mo</li>
                <li className="flex items-center gap-2 text-sm text-secondary/60"><CheckCircle2 className="w-4 h-4 text-secondary" /> Team Collaboration</li>
              </ul>
              <Link href="/pricing" className="block w-full py-3 bg-secondary/5 text-secondary rounded-full text-center font-bold hover:bg-secondary/10 transition-all">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-secondary">Frequently Asked Questions</h2>
            <p className="text-secondary/60">Everything you need to know about OmniAdapts.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className="bg-neutral p-2 rounded-[2rem] border border-secondary/10 overflow-hidden transition-all shadow-sm"
              >
                <div className="bg-primary/30 rounded-[1.5rem] overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-primary/50 transition-colors"
                  >
                    <span className="font-bold text-secondary">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-secondary/40 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-sm text-secondary/60 leading-relaxed border-t border-secondary/10 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral border-y border-secondary/10 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-secondary">Ready to scale your content?</h2>
            <p className="text-secondary/60 max-w-xl text-lg">
              Join thousands of creators and marketers who use OmniAdapts to dominate every digital platform.
            </p>
            <Link
              href="/tool"
              className="px-10 py-5 bg-secondary text-neutral rounded-full font-bold text-lg hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32" />
      </section>
    </div>
  );
}
