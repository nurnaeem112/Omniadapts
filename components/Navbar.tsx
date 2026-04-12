"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Tool', path: '/tool' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="glass sticky top-4 z-50 mx-auto mt-4 rounded-full shadow-sm max-w-[1200px] w-[calc(100%-2rem)]">
      <div className="px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-neutral" />
          </div>
          <span className="text-xl font-black tracking-tight text-secondary">OmniAdapts</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest transition-all relative py-1",
                  pathname === link.path 
                    ? "text-secondary" 
                    : "text-secondary/40 hover:text-secondary"
                )}
              >
                {link.name}
                {pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 border-l border-secondary/10 pl-8">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                    pathname === '/profile'
                      ? "bg-secondary text-neutral shadow-lg shadow-secondary/20"
                      : "text-secondary/40 hover:text-secondary hover:bg-secondary/5"
                  )}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-secondary/40 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-widest text-secondary/40 hover:text-secondary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-secondary text-neutral rounded-full text-xs font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-secondary/70 hover:text-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-primary border-b border-secondary/10 px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "block text-base font-medium transition-colors",
                location.pathname === link.path ? "text-secondary font-bold" : "text-secondary/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-secondary/10 space-y-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block w-full text-center px-4 py-3 border border-secondary/10 text-secondary rounded-full text-sm font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-3 bg-red-500/10 text-red-500 rounded-full text-sm font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-3 border border-secondary/10 text-secondary rounded-full text-sm font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center px-4 py-3 bg-secondary text-neutral rounded-full text-sm font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
