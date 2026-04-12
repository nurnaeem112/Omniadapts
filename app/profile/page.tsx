"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Shield, Zap, LogOut, CreditCard, Settings, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getPlanByName } from '@/constants/pricing';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  plan?: string;
  created_at?: string;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    postsGenerated: 0,
    platformsUsed: 0,
    timeSaved: '0h',
    monthlyUsage: 0
  });

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      alert('Payment successful! Your subscription is being updated.');
      // Clear the URL parameter
      router.replace('/profile');
    }

    async function getProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      const userPlanName = authUser.user_metadata?.plan || 'Free';
      const plan = getPlanByName(userPlanName);

      setUser({
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || 'User',
        plan: plan.name,
        created_at: authUser.created_at,
      });

      // Fetch stats from Supabase
      const { data: generations, error } = await supabase
        .from('generations')
        .select('results, selected_platforms, created_at');

      if (!error && generations) {
        const totalPosts = generations.reduce((acc, gen) => acc + Object.keys(gen.results || {}).length, 0);
        const platforms = new Set();
        
        // Calculate monthly usage
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyGenerations = generations.filter(gen => new Date(gen.created_at) >= startOfMonth).length;

        generations.forEach(gen => {
          if (gen.selected_platforms) {
            gen.selected_platforms.forEach((p: string) => platforms.add(p));
          }
        });
        
        setStats({
          postsGenerated: totalPosts,
          platformsUsed: platforms.size,
          timeSaved: `${Math.round(totalPosts * 0.25)}h`,
          monthlyUsage: monthlyGenerations
        });
      }

      setLoading(false);
    }

    getProfile();
  }, [router, searchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  const currentPlan = getPlanByName(user?.plan || 'Free');
  const usagePercentage = Math.min(100, (stats.monthlyUsage / currentPlan.limit) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="w-24 h-24 bg-secondary rounded-[2rem] flex items-center justify-center shadow-2xl">
            <User className="w-12 h-12 text-neutral" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase">
              {user?.full_name}
            </h1>
            <p className="text-lg text-secondary/60 font-medium">Manage your account and subscription.</p>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-8 py-4 bg-red-500/10 text-red-500 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-neutral transition-all border border-red-500/20 group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-8"
        >
          <div className="bg-neutral p-10 rounded-[3rem] border border-secondary/10 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-secondary tracking-tight uppercase flex items-center gap-3">
              <Settings className="w-6 h-6" />
              Account Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Email Address
                </label>
                <p className="text-lg font-bold text-secondary">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Member Since
                </label>
                <p className="text-lg font-bold text-secondary">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Account ID
                </label>
                <p className="text-xs font-mono font-bold text-secondary/60 truncate">{user?.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral p-10 rounded-[3rem] border border-secondary/10 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-secondary tracking-tight uppercase flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              Monthly Usage
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-secondary/60 uppercase tracking-widest">Generations Used</p>
                <p className="text-2xl font-black text-secondary">{stats.monthlyUsage} / {currentPlan.limit}</p>
              </div>
              <div className="w-full h-4 bg-secondary/5 rounded-full overflow-hidden border border-secondary/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercentage}%` }}
                  className={cn(
                    "h-full rounded-full transition-all",
                    usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-orange-500" : "bg-secondary"
                  )}
                />
              </div>
              <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em]">
                Your limit resets on the 1st of next month.
              </p>
            </div>
          </div>

          <div className="bg-neutral p-10 rounded-[3rem] border border-secondary/10 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-secondary tracking-tight uppercase flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Lifetime Statistics
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Posts', value: stats.postsGenerated.toString() },
                { label: 'Platforms', value: stats.platformsUsed.toString() },
                { label: 'Time Saved', value: stats.timeSaved },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                  <p className="text-2xl font-black text-secondary">{stat.value}</p>
                  <p className="text-[8px] font-black text-secondary/40 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-secondary p-10 rounded-[3rem] text-neutral space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neutral/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight uppercase">Current Plan</h2>
                <CreditCard className="w-6 h-6 opacity-50" />
              </div>
              
              <div className="space-y-2">
                <p className="text-4xl font-black tracking-tighter uppercase">{user?.plan}</p>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
                  {currentPlan.id === 'free' ? 'No Billing' : `Billed ${currentPlan.period}`}
                </p>
              </div>

              <button 
                onClick={() => router.push('/pricing')}
                className="w-full py-4 bg-neutral text-secondary rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-neutral/90 transition-all shadow-xl"
              >
                {currentPlan.id === 'free' ? 'Upgrade Plan' : 'Change Plan'}
              </button>
            </div>
          </div>

          <div className="bg-neutral p-8 rounded-[2.5rem] border border-secondary/10 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-secondary uppercase tracking-widest">Need Help?</h3>
            <p className="text-xs text-secondary/60 font-medium leading-relaxed">
              Have questions about your account or plan? Our support team is here to help.
            </p>
            <button className="text-xs font-black text-secondary uppercase tracking-widest hover:underline">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
