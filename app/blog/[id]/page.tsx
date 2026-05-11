"use client";

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, MessageSquare, Heart } from 'lucide-react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { BLOG_POSTS } from '../blogData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BlogPostPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    notFound();
  }

  const Icon = post.icon;

  return (
    <div className="py-24 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" />
      
      {/* SEO Metadata (handled by head in Next.js, but here for reference) */}
      <title>{post.metaTitle}</title>
      <meta name="description" content={post.metaDescription} />

      <div className="max-w-4xl mx-auto px-4 w-full relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 hover:text-secondary transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 mb-16"
        >
          <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 bg-secondary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
              {post.category}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/10" />
            <div className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">
              {post.readTime}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter leading-[0.95]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-secondary/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/5 rounded-full flex items-center justify-center border border-secondary/10">
                <User className="w-6 h-6 text-secondary/40" />
              </div>
              <div>
                <div className="text-xs font-black text-secondary uppercase tracking-widest">{post.author}</div>
                <div className="text-[10px] font-bold text-secondary/40 uppercase tracking-tighter">Author</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/5 rounded-full flex items-center justify-center border border-secondary/10">
                <Calendar className="w-6 h-6 text-secondary/40" />
              </div>
              <div>
                <div className="text-xs font-black text-secondary uppercase tracking-widest">{post.date}</div>
                <div className="text-[10px] font-bold text-secondary/40 uppercase tracking-tighter">Published</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-[21/9] rounded-[4rem] overflow-hidden border border-secondary/10 shadow-2xl mb-20"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose prose-xl prose-secondary max-w-none 
              prose-headings:text-secondary prose-headings:font-black prose-headings:tracking-tight
              prose-p:text-secondary/70 prose-p:leading-relaxed prose-p:font-medium
              prose-strong:text-secondary prose-strong:font-black
              prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:bg-secondary/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:font-black prose-blockquote:text-secondary/80
              prose-a:text-secondary prose-a:font-black prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-secondary/60 transition-all
              prose-ul:list-disc prose-ol:list-decimal prose-li:text-secondary/70 prose-li:font-medium"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:sticky lg:top-32 space-y-8 w-full lg:w-48"
          >
            <div className="p-8 bg-neutral border border-secondary/10 rounded-[3rem] space-y-8 shadow-sm">
              <button className="flex flex-col items-center gap-2 group w-full">
                <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center border border-secondary/10 group-hover:bg-secondary group-hover:text-neutral transition-all duration-500 shadow-sm">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">124</span>
              </button>
              
              <button className="flex flex-col items-center gap-2 group w-full">
                <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center border border-secondary/10 group-hover:bg-secondary group-hover:text-neutral transition-all duration-500 shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">12</span>
              </button>

              <button className="flex flex-col items-center gap-2 group w-full">
                <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center border border-secondary/10 group-hover:bg-secondary group-hover:text-neutral transition-all duration-500 shadow-sm">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Share</span>
              </button>
            </div>
            
            <div className="p-8 bg-secondary text-neutral rounded-[3rem] space-y-6 shadow-2xl shadow-secondary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neutral/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <p className="text-sm font-black leading-tight relative z-10">Want to automate your content?</p>
              <Link href="/tool" className="block w-full py-4 bg-neutral text-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest text-center relative z-10 hover:scale-105 transition-transform">
                Try Tool
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
