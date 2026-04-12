import { Zap, Sparkles, Target, Globe, CheckCircle2, Users, Shield, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  const values = [
    { title: 'Innovation', description: 'We push the boundaries of AI to deliver the most creative and effective content adaptation.', icon: Sparkles },
    { title: 'Efficiency', description: 'We value your time. Our tool is built to save hours of manual copywriting.', icon: Zap },
    { title: 'Authenticity', description: 'We believe in platform-native content that feels real and resonates with audiences.', icon: Users },
    { title: 'Security', description: 'Your data and brand information are protected with industry-standard security.', icon: Shield },
  ];

  return (
    <div className="flex flex-col py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 space-y-32 relative z-10">
        {/* Hero */}
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-[0.2em]"
          >
            Our Mission
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-secondary leading-[0.9]"
          >
            Adapting Messages for a <br />
            <span className="text-secondary/40">Multi-Platform World.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-secondary/60 leading-relaxed font-medium max-w-3xl mx-auto"
          >
            OmniAdapts was born from a simple observation: the digital landscape is fragmented, and every platform has its own unique language. We built a tool that speaks them all.
          </motion.p>
        </div>

        {/* The Problem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">The Challenge</h2>
            <div className="space-y-6">
              <p className="text-secondary/60 leading-relaxed font-medium text-lg">
                In today's digital age, being on just one platform isn't enough. But writing unique, high-quality copy for Twitter, LinkedIn, Instagram, TikTok, and Reddit is exhausting.
              </p>
              <p className="text-secondary/60 leading-relaxed font-medium text-lg">
                Most marketers either settle for generic copy that fails to resonate, or spend hours manually rewriting the same message. Neither is sustainable for growth.
              </p>
            </div>
          </div>
          <div className="bg-neutral rounded-[4rem] p-12 border border-secondary/10 aspect-square flex items-center justify-center shadow-sm relative group overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-40 h-40 bg-secondary rounded-full flex items-center justify-center relative z-10 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                <Zap className="w-20 h-20 text-neutral" />
              </div>
              <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-secondary/10 rounded-full -z-10 rotate-12 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-secondary/10 rounded-full -z-10 -rotate-12 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase">Our Core Values</h2>
            <p className="text-secondary/60 max-w-xl mx-auto text-lg font-medium">
              These principles guide everything we build at OmniAdapts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {values.map((value) => (
              <div key={value.title} className="p-10 bg-neutral rounded-[3rem] border border-secondary/10 shadow-sm space-y-6 hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-secondary/5 rounded-full flex items-center justify-center border border-secondary/10 group-hover:bg-secondary group-hover:border-secondary transition-colors duration-500">
                  <value.icon className="w-8 h-8 text-secondary group-hover:text-neutral transition-colors duration-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-secondary tracking-tight uppercase">{value.title}</h3>
                  <p className="text-secondary/60 leading-relaxed font-medium">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Vision */}
        <div className="bg-neutral rounded-[4rem] p-16 md:p-24 text-center space-y-10 border border-secondary/10 relative overflow-hidden shadow-sm group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-secondary/10">
              <Rocket className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-secondary uppercase">The Future of Content</h2>
            <p className="text-secondary/60 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
              We envision a world where great ideas aren't limited by platform constraints. OmniAdapts is just the beginning of a suite of tools designed to democratize high-level marketing strategy for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
