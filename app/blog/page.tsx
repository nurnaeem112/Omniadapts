"use client";

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, User, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Adapt Your Marketing Message for Every Social Platform",
    excerpt: "Learn the secrets of platform-specific content adaptation and why a one-size-fits-all approach is killing your engagement.",
    author: "Marketing Expert",
    date: "Mar 28, 2026",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/marketing/800/450",
    category: "Strategy",
    icon: Target
  },
  {
    id: 2,
    title: "The Rise of AI in Content Creation: A Guide for Modern Marketers",
    excerpt: "Explore how AI tools like OmniAdapts are revolutionizing the way we create and distribute content across digital channels.",
    author: "AI Strategist",
    date: "Mar 25, 2026",
    readTime: "7 min read",
    image: "https://picsum.photos/seed/ai/800/450",
    category: "Technology",
    icon: Sparkles
  },
  {
    id: 3,
    title: "10 Tips for Writing High-Converting Social Media Copy",
    excerpt: "From hooks to calls-to-action, discover the essential elements of copy that actually drives results on social media.",
    author: "Copywriter",
    date: "Mar 20, 2026",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/copy/800/450",
    category: "Copywriting",
    icon: Zap
  }
];

export default function BlogPage() {
  return (
    <div className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="text-center mb-24 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <BookOpen className="w-3 h-3 text-secondary" />
            Our Blog
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-secondary tracking-tighter leading-[0.9]"
          >
            Insights & <br />
            <span className="text-secondary/40">Strategies.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-secondary/60 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Stay ahead of the curve with our latest articles on content adaptation, social media marketing, and AI technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-neutral rounded-[3.5rem] border border-secondary/10 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-secondary/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-neutral shadow-xl">
                  {post.category}
                </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center gap-5 text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    {post.readTime}
                  </div>
                </div>
                
                <h2 className="text-2xl font-black text-secondary tracking-tight mb-5 group-hover:text-secondary/70 transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-base text-secondary/60 leading-relaxed mb-8 flex-1 font-medium">
                  {post.excerpt}
                </p>
                
                <div className="pt-8 border-t border-secondary/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/5 rounded-full flex items-center justify-center border border-secondary/10">
                      <User className="w-5 h-5 text-secondary/40" />
                    </div>
                    <span className="text-xs font-black text-secondary uppercase tracking-widest">{post.author}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-secondary/70 hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-16 bg-neutral border border-secondary/10 rounded-[4rem] text-center relative overflow-hidden shadow-sm group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-secondary tracking-tighter">
                Subscribe to Our <span className="text-secondary/40">Newsletter.</span>
              </h2>
              <p className="text-secondary/60 max-w-md mx-auto text-lg font-medium leading-relaxed">
                Get the latest marketing insights and OmniAdapts updates delivered straight to your inbox.
              </p>
            </div>
            
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-8 py-5 bg-neutral border border-secondary/10 rounded-full text-secondary placeholder:text-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
              />
              <button className="px-10 py-5 bg-secondary text-neutral rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20">
                Join Now
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
