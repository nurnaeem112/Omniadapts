"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, Suspense } from 'react';

import { supabase } from '@/lib/supabase';
import {
  Send,
  Copy,
  RefreshCw,
  Sparkles,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  MessageSquare,
  Hash,
  Layout,
  ExternalLink,
  Check,
  Plus,
  X,
  Globe,
  ChevronLeft,
  ChevronRight,
  Info,
  Zap,
  Target,
  ArrowRight,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlanByName } from '@/constants/pricing';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Platform = {
  id: string;
  name: string;
  icon?: any;
  iconUrl?: string;
  color: string;
};

const PLATFORMS: Platform[] = [
  { id: 'twitter', name: 'Twitter (X)', iconUrl: 'https://cdn.simpleicons.org/x', color: 'hover:text-black' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'hover:text-blue-600' },
  { id: 'instagram_feed', name: 'Instagram Feed', iconUrl: 'https://cdn.simpleicons.org/instagram', color: 'hover:text-pink-600' },
  { id: 'instagram_stories', name: 'Instagram Stories', iconUrl: 'https://cdn.simpleicons.org/instagram', color: 'hover:text-orange-500' },
  { id: 'tiktok', name: 'TikTok', iconUrl: 'https://cdn.simpleicons.org/tiktok', color: 'hover:text-black' },
  { id: 'facebook', name: 'Facebook', iconUrl: 'https://cdn.simpleicons.org/facebook', color: 'hover:text-blue-700' },
  { id: 'pinterest', name: 'Pinterest', iconUrl: 'https://cdn.simpleicons.org/pinterest', color: 'hover:text-red-600' },
  { id: 'reddit', name: 'Reddit', iconUrl: 'https://cdn.simpleicons.org/reddit', color: 'hover:text-orange-600' },
  { id: 'youtube', name: 'YouTube', iconUrl: 'https://cdn.simpleicons.org/youtube', color: 'hover:text-red-600' },
  { id: 'discord_telegram', name: 'Discord/Telegram', iconUrl: 'https://cdn.simpleicons.org/discord', color: 'hover:text-indigo-500' },
  { id: 'email', name: 'Email Newsletter', icon: Mail, color: 'hover:text-zinc-600' },
  { id: 'quora', name: 'Quora', iconUrl: 'https://cdn.simpleicons.org/quora', color: 'hover:text-red-700' },
];

const SYSTEM_INSTRUCTION = `You are "OmniAdapts," an expert social media marketing and copywriting strategist. Your primary function is to receive a single, raw marketing message from a user and adapt it to suit the specific culture, format limitations, and audience expectations of various digital platforms.

For every platform requested by the user, you must generate unique, platform-appropriate copy. You must strictly adhere to the following guidelines for each platform:

1. Twitter (X): Concise, witty, and urgent. Max 280 characters. Use relevant hashtags (max 2-3). Focus on a hook.
2. LinkedIn: Professional, insightful, and value-driven. Longer form (1000-2000 chars). Start with a question or a bold statement. Use line breaks for readability. Hashtags are professional (#Innovation, #Tech).
3. Instagram (Feed): Visually descriptive, emotional, and community-focused. Copy should complement an image. Use line breaks and emojis strategically. Place key hashtags in the first comment or at the end (up to 15-20).
4. Instagram (Stories): Ultra-short, casual, and urgent. Use "Question stickers" or "Poll" formats in the text. Create a sense of "right now."
5. TikTok: Script-based. Focus on the first 3 seconds (the hook). Fast-paced, trending audio references, and a clear call-to-action. Use relevant text overlays.
6. Facebook: Storytelling, community-oriented, and slightly more personal. Good for longer posts, event sharing, and fostering discussion.
7. Pinterest: Descriptive, keyword-rich, and aspirational. Write like a search engine optimized description. Focus on the solution the pin provides. Include keywords and hashtags.
8. Reddit: Authentic, non-salesy, and value-adding. Write in a conversational tone. Never sound like an ad. Focus on solving a problem or sharing a personal experience related to the product. You must include "[Discussion]" or "[Review]" context.
9. YouTube (Description): SEO-focused. The first 150 characters are crucial. Include links (timestamp, socials), a brief summary, and a block of long-tail keyword tags.
10. Discord/Telegram: Casual, community-first. Short blasts. Focus on exclusivity ("Community only") and driving engagement (reactions, replies).
11. Email Newsletter: Compelling subject line first. Body should be conversational and value-packed. Focus on a single call-to-action.
12. Quora: Answer-based. Use the "Problem -> Solution -> Product" framework. Provide massive value in the answer first, then subtly introduce the product as *a* solution.
13. Custom Website/URL: If a specific website URL is provided as a target, generate a high-converting blog post or landing page copy that fits the existing style and content of that specific website.

Output Structure:
For each platform (including custom URLs), output the copy clearly separated by a header (e.g., --- TWITTER --- or --- https://example.com ---).
Inside each platform section, follow this exact format:
Explanation: [One sentence explaining the strategy]
Title: [A compelling title, headline, or opening hook]
Description: [The main body copy or script]
Tags: [Relevant hashtags or keywords]

Ensure every field is present for every platform. If a platform doesn't typically have a title (like Twitter), use the opening hook as the Title. Do not use any other headers or formatting within the platform section.`;

type PlatformResult = {
  explanation: string;
  title: string;
  description: string;
  tags: string;
};

function ToolContent() {
  const [formData, setFormData] = useState(() => {
    if (typeof window === 'undefined') return {
      name: '',
      description: '',
      goal: '',
      audience: '',
      problem: '',
      benefit: '',
      cta: '',
      keywords: ''
    };
    const saved = sessionStorage.getItem('omni_formData');
    return saved ? JSON.parse(saved) : {
      name: '',
      description: '',
      goal: '',
      audience: '',
      problem: '',
      benefit: '',
      cta: '',
      keywords: ''
    };
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = sessionStorage.getItem('omni_selectedPlatforms');
    return saved ? JSON.parse(saved) : [];
  });

  const [customUrls, setCustomUrls] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = sessionStorage.getItem('omni_customUrls');
    return saved ? JSON.parse(saved) : [];
  });

  const [urlInput, setUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPlan, setUserPlan] = useState<any>(null);
  const [monthlyUsage, setMonthlyUsage] = useState(0);

  const [results, setResults] = useState<Record<string, PlatformResult>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = sessionStorage.getItem('omni_results');
    return saved ? JSON.parse(saved) : {};
  });

  const [activePlatform, setActivePlatform] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('omni_activePlatform');
  });

  const [viewMode, setViewMode] = useState<'tabs' | 'list'>(() => {
    if (typeof window === 'undefined') return 'tabs';
    const saved = sessionStorage.getItem('omni_viewMode');
    return (saved as 'tabs' | 'list') || 'tabs';
  });

  const [history, setHistory] = useState<Array<{
    id: string;
    created_at: string;
    formData: typeof formData;
    results: Record<string, PlatformResult>;
    selectedPlatforms: string[];
    customUrls: string[];
  }>>([]);

  const [error, setError] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('omni_error');
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'input' | 'output'>(() => {
    if (typeof window === 'undefined') return 'input';
    const saved = sessionStorage.getItem('omni_activeTab');
    return (saved as 'input' | 'output') || 'input';
  });

  // Persist form state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('omni_formData', JSON.stringify(formData));
      sessionStorage.setItem('omni_selectedPlatforms', JSON.stringify(selectedPlatforms));
      sessionStorage.setItem('omni_customUrls', JSON.stringify(customUrls));
      sessionStorage.setItem('omni_results', JSON.stringify(results));
      sessionStorage.setItem('omni_viewMode', viewMode);
      sessionStorage.setItem('omni_activeTab', activeTab);

      if (error) sessionStorage.setItem('omni_error', error);
      else sessionStorage.removeItem('omni_error');

      if (activePlatform) sessionStorage.setItem('omni_activePlatform', activePlatform);
      else sessionStorage.removeItem('omni_activePlatform');
    }
  }, [formData, selectedPlatforms, customUrls, results, viewMode, activeTab, error, activePlatform]);

  // Fetch history and usage from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const planName = user.user_metadata?.plan || 'Free';
      setUserPlan(getPlanByName(planName));

      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
      } else if (data) {
        setHistory(data.map(item => ({
          id: item.id,
          created_at: item.created_at,
          formData: item.form_data,
          results: item.results,
          selectedPlatforms: item.selected_platforms,
          customUrls: item.custom_urls
        })));

        // Calculate monthly usage
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyGenerations = data.filter(gen => new Date(gen.created_at) >= startOfMonth).length;
        setMonthlyUsage(monthlyGenerations);
      }
    };

    fetchData();
  }, []);

  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [results, customUrls, viewMode, activeTab]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollEl.scrollLeft += e.deltaY;
      }
    };

    scrollEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollEl.removeEventListener('wheel', handleWheel);
  }, [results, customUrls, viewMode, activeTab]);

  useEffect(() => {
    if (Object.keys(results).length > 0 && activeTab === 'output') {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results, activeTab]);

  const addUrl = () => {
    if (urlInput.trim() && !customUrls.includes(urlInput.trim())) {
      setCustomUrls(prev => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const removeUrl = (url: string) => {
    setCustomUrls(prev => prev.filter(u => u !== url));
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedPlatforms.length === PLATFORMS.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(PLATFORMS.map(p => p.id));
    }
  };

  const handleGenerate = async () => {
    if (userPlan && monthlyUsage >= userPlan.limit) {
      setError(`You have reached your monthly limit of ${userPlan.limit} generations. Please upgrade your plan to continue.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isFormValid = Object.values(formData).some(v => (v as string).trim() !== '');
    if (!isFormValid) {
      setError("Please fill in at least one field to generate copy.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (selectedPlatforms.length === 0 && customUrls.length === 0) {
      setError("Please select at least one platform or add a custom URL.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults({});
    setActiveTab('output');

    try {

      const model = "gemini-1.5-pro"; // Using gemini-1.5-flash as requested

      const platformNames = [
        ...PLATFORMS.filter(p => selectedPlatforms.includes(p.id)).map(p => p.name),
        ...customUrls
      ].join(', ');

      const prompt = `Adapt the following product information for these platforms: ${platformNames}.\n\nProduct/Service Name: ${formData.name}\nOne-sentence Description: ${formData.description}\nMain Goal/Intention: ${formData.goal}\nTarget Audience: ${formData.audience}\nProblem Solved: ${formData.problem}\nEmotional Benefit: ${formData.benefit}\nCall to Action: ${formData.cta}\nLinks/Keywords: ${formData.keywords}`;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: SYSTEM_INSTRUCTION
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      const text = data.text || '';
      const parsedResults = parseResults(text);

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: savedItem, error: saveError } = await supabase
          .from('generations')
          .insert({
            user_id: user.id,
            name: formData.name || 'Untitled Generation',
            form_data: formData,
            results: parsedResults,
            selected_platforms: selectedPlatforms,
            custom_urls: customUrls
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving to Supabase:', saveError);
        } else if (savedItem) {
          setHistory(prev => [{
            id: savedItem.id,
            created_at: savedItem.created_at,
            formData: savedItem.form_data,
            results: savedItem.results,
            selectedPlatforms: savedItem.selected_platforms,
            customUrls: savedItem.custom_urls
          }, ...prev]);
          setMonthlyUsage(prev => prev + 1);
        }
      }

      setResults(parsedResults);

      const firstPlatform = Object.keys(parsedResults)[0];
      if (firstPlatform) {
        setActivePlatform(firstPlatform);
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An error occurred during generation.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsGenerating(false);
    }
  };

  const parseResults = (text: string) => {
    const sections = text.split(/--- (.*?) ---/);
    const newResults: Record<string, PlatformResult> = {};

    for (let i = 1; i < sections.length; i += 2) {
      const platformName = sections[i].trim().toUpperCase();
      const content = sections[i + 1].trim();

      const platform = PLATFORMS.find(p =>
        platformName === p.name.toUpperCase() ||
        platformName === p.id.toUpperCase() ||
        platformName.includes(p.name.toUpperCase()) ||
        p.name.toUpperCase().includes(platformName)
      );

      const customUrl = customUrls.find(url => platformName.includes(url.toUpperCase()));
      const resultKey = platform ? platform.id : (customUrl || platformName.toLowerCase());

      const expMatch = content.match(/Explanation:\s*(.*)/i);
      const titleMatch = content.match(/Title:\s*(.*)/i);
      const descMatch = content.match(/Description:\s*([\s\S]*?)(?=Tags:|$)/i);
      const tagsMatch = content.match(/Tags:\s*(.*)/i);

      newResults[resultKey] = {
        explanation: expMatch ? expMatch[1].trim() : '',
        title: titleMatch ? titleMatch[1].trim() : '',
        description: descMatch ? descMatch[1].trim() : '',
        tags: tagsMatch ? tagsMatch[1].trim() : ''
      };
    }
    return newResults;
  };

  const loadFromHistory = (item: any) => {
    setFormData(item.formData);
    setResults(item.results);
    setSelectedPlatforms(item.selectedPlatforms);
    setCustomUrls(item.customUrls);
    setActiveTab('output');
    const firstPlatform = Object.keys(item.results)[0];
    if (firstPlatform) {
      setActivePlatform(firstPlatform);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAll = (platformId: string) => {
    const res = results[platformId];
    if (!res) return;
    const text = `Strategy: ${res.explanation}\n\nTitle/Hook: ${res.title}\n\nDescription:\n${res.description}\n\nTags: ${res.tags}`;
    copyToClipboard(text, `${platformId}-all`);
  };

  const clearHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing history:', error);
    } else {
      setHistory([]);
    }
  };

  const deleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
    } else {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="py-12 min-h-screen relative">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="lg:hidden flex p-1.5 bg-neutral border border-secondary/10 rounded-full mb-8 mx-4 relative z-10">
        <button
          onClick={() => setActiveTab('input')}
          className={cn(
            "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-full transition-all",
            activeTab === 'input' ? "bg-secondary text-neutral shadow-lg" : "text-secondary/40"
          )}
        >
          Configure
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={cn(
            "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2",
            activeTab === 'output' ? "bg-secondary text-neutral shadow-lg" : "text-secondary/40"
          )}
        >
          Results
          {Object.keys(results).length > 0 && (
            <span className="w-2 h-2 bg-neutral rounded-full animate-pulse" />
          )}
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-[2.5rem] text-xs font-black uppercase tracking-widest flex items-center gap-4 shadow-sm mb-8"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-red-800 mb-0.5">Generation Error</p>
              <p className="text-red-500/80 font-bold normal-case">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10 px-4 sm:px-6">
        <div className={cn(
          "lg:col-span-5 space-y-8 lg:sticky lg:top-24",
          activeTab !== 'input' && "hidden lg:block"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary rounded-[3rem] border border-secondary/10 p-8 shadow-sm space-y-8"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-secondary/10">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-neutral" />
              </div>
              <div>
                <h2 className="text-lg font-black text-secondary tracking-tight">Core Message</h2>
                <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Define your product essence</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 group-focus-within:text-secondary transition-colors">
                  Product/Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., EcoCharge Pro"
                  className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 group-focus-within:text-secondary transition-colors">
                  One-sentence Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="e.g., A solar-powered portable charger that folds up like a credit card."
                  className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-[2rem] focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary h-24 resize-none transition-all placeholder:text-secondary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 group-focus-within:text-secondary transition-colors">
                    Main Goal
                  </label>
                  <input
                    type="text"
                    value={formData.goal}
                    onChange={(e) => updateField('goal', e.target.value)}
                    placeholder="e.g., Pre-orders"
                    className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 group-focus-within:text-secondary transition-colors">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.audience}
                    onChange={(e) => updateField('audience', e.target.value)}
                    placeholder="e.g., Digital nomads"
                    className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 group-focus-within:text-secondary transition-colors">
                    Problem Solved
                  </label>
                  <textarea
                    value={formData.problem}
                    onChange={(e) => updateField('problem', e.target.value)}
                    placeholder="e.g., Battery anxiety while traveling."
                    className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-[2rem] focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary h-24 resize-none transition-all placeholder:text-secondary/20"
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 group-focus-within:text-secondary transition-colors">
                    Emotional Benefit
                  </label>
                  <textarea
                    value={formData.benefit}
                    onChange={(e) => updateField('benefit', e.target.value)}
                    placeholder="e.g., Freedom to explore anywhere."
                    className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-[2rem] focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary h-24 resize-none transition-all placeholder:text-secondary/20"
                  />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center gap-1.5 text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-2 group-focus-within:text-secondary transition-colors">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={formData.cta}
                  onChange={(e) => updateField('cta', e.target.value)}
                  placeholder="e.g., Visit our Kickstarter"
                  className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary rounded-[3rem] border border-secondary/10 p-8 shadow-sm space-y-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Layout className="w-5 h-5 text-neutral" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-secondary tracking-tight">Platforms</h2>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Select your targets</p>
                </div>
              </div>
              <button
                onClick={selectAll}
                className="text-[10px] font-black text-secondary uppercase tracking-widest hover:text-secondary/60 transition-colors"
              >
                {selectedPlatforms.length === PLATFORMS.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-4 rounded-[2rem] border text-[10px] font-black uppercase tracking-widest transition-all relative group",
                    selectedPlatforms.includes(platform.id)
                      ? "bg-secondary border-secondary text-neutral shadow-xl scale-[1.02]"
                      : "bg-neutral border-secondary/5 text-secondary/40 hover:border-secondary/20 hover:bg-neutral/80"
                  )}
                >
                  <div className={cn("w-6 h-6 transition-transform group-hover:scale-110 flex items-center justify-center", !selectedPlatforms.includes(platform.id) && "opacity-40")}>
                    {platform.icon ? (
                      <platform.icon className={cn("w-full h-full", selectedPlatforms.includes(platform.id) ? "text-neutral" : "text-secondary")} />
                    ) : (
                      <img
                        src={platform.iconUrl}
                        alt={platform.name}
                        className={cn("w-full h-full object-contain", selectedPlatforms.includes(platform.id) ? "brightness-0 invert" : "")}
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <span className="truncate w-full text-center">{platform.name.split(' ')[0]}</span>
                  {selectedPlatforms.includes(platform.id) && (
                    <motion.div
                      layoutId="active-check"
                      className="absolute top-2 right-2"
                    >
                      <Check className="w-3 h-3 text-neutral" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Custom Context URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                  placeholder="https://example.com"
                  className="w-full px-5 py-4 bg-neutral border border-secondary/10 rounded-full focus:ring-2 focus:ring-secondary focus:bg-primary outline-none text-sm text-secondary transition-all placeholder:text-secondary/20"
                />
                <button
                  onClick={addUrl}
                  className="p-4 bg-secondary text-neutral rounded-full hover:bg-secondary/80 transition-colors shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <AnimatePresence>
                {customUrls.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {customUrls.map((url) => (
                      <motion.div
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        key={url}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral border border-secondary/10 rounded-full text-[10px] font-black text-secondary/60 group uppercase tracking-widest"
                      >
                        <span className="max-w-[120px] truncate">{url.replace('https://', '')}</span>
                        <button
                          onClick={() => removeUrl(url)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !Object.values(formData).some(v => (v as string).trim() !== '') || (selectedPlatforms.length === 0 && customUrls.length === 0)}
            className="w-full py-6 bg-secondary text-neutral rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-secondary/20 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isGenerating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                Adapting Content...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Copy
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary rounded-[3rem] border border-secondary/10 p-8 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-secondary/10">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-black text-secondary tracking-tight">History</h2>
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Recent generations</p>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-[10px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full p-4 bg-neutral border border-secondary/5 rounded-[1.5rem] hover:border-secondary/20 transition-all text-left group relative"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => deleteHistoryItem(e, item.id)}
                          className="p-1 hover:text-red-500 text-secondary/20 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-secondary/20 group-hover:text-secondary transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-secondary/60 truncate pr-8">{item.formData.name || 'Untitled Generation'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.keys(item.results).map(key => {
                        const p = PLATFORMS.find(plat => plat.id === key);
                        if (!p) return null;
                        return (
                          <div key={key} className="w-3.5 h-3.5 flex items-center justify-center">
                            {p.icon ? (
                              <p.icon className="w-full h-full text-secondary opacity-40" />
                            ) : (
                              <img
                                src={p.iconUrl}
                                alt={p.name}
                                className="w-full h-full object-contain opacity-40"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div
          ref={resultsRef}
          className={cn(
            "lg:col-span-7 space-y-12",
            activeTab !== 'output' && "hidden lg:block"
          )}
        >
          <AnimatePresence mode="wait">
            {Object.keys(results).length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <h2 className="text-3xl font-black text-secondary tracking-tighter">Generated Copy</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex p-1 bg-neutral border border-secondary/10 rounded-full shadow-sm">
                      <button
                        onClick={() => setViewMode('tabs')}
                        className={cn(
                          "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all",
                          viewMode === 'tabs' ? "bg-secondary text-neutral shadow-md" : "text-secondary/40 hover:text-secondary/60"
                        )}
                      >
                        Tabs
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all",
                          viewMode === 'list' ? "bg-secondary text-neutral shadow-md" : "text-secondary/40 hover:text-secondary/60"
                        )}
                      >
                        List All
                      </button>
                    </div>
                  </div>
                </div>

                {viewMode === 'tabs' ? (
                  <>
                    <div className="sticky top-24 z-20 bg-primary/80 backdrop-blur-md pt-2 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                      <div className="relative group/scroll">
                        <AnimatePresence>
                          {canScrollLeft && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => scroll('left')}
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-primary border border-secondary/10 rounded-full shadow-xl text-secondary hover:bg-secondary hover:text-neutral transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </motion.button>
                          )}
                        </AnimatePresence>

                        <div
                          ref={scrollRef}
                          onScroll={checkScroll}
                          className="flex items-center gap-3 overflow-x-auto scrollbar-custom pb-4 px-10 scroll-smooth"
                        >
                          {[...PLATFORMS, ...customUrls.map(url => ({ id: url, name: url, iconUrl: 'https://cdn.simpleicons.org/googlechrome', color: 'text-secondary/60' } as Platform))]
                            .filter(p => results[p.id])
                            .map((platform) => (
                              <button
                                key={platform.id}
                                onClick={() => setActivePlatform(platform.id)}
                                className={cn(
                                  "flex items-center gap-3 px-6 py-4 rounded-full border text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 relative",
                                  activePlatform === platform.id
                                    ? "border-secondary text-neutral shadow-lg"
                                    : "bg-neutral border-secondary/5 text-secondary/40 hover:border-secondary/20 hover:bg-neutral/80"
                                )}
                              >
                                {activePlatform === platform.id && (
                                  <motion.div
                                    layoutId="active-platform-bg"
                                    className="absolute inset-0 bg-secondary rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                                <div className="w-4 h-4 relative z-10 flex items-center justify-center">
                                  {platform.icon ? (
                                    <platform.icon className={cn("w-full h-full", activePlatform === platform.id ? "text-neutral" : "text-secondary")} />
                                  ) : (
                                    <img
                                      src={platform.iconUrl}
                                      alt={platform.name}
                                      className={cn("w-full h-full object-contain", activePlatform === platform.id ? "brightness-0 invert" : "")}
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                </div>
                                <span className="relative z-10">{platform.name.split(' ')[0]}</span>
                              </button>
                            ))}
                        </div>

                        <AnimatePresence>
                          {canScrollRight && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => scroll('right')}
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-primary border border-secondary/10 rounded-full shadow-xl text-secondary hover:bg-secondary hover:text-neutral transition-all"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {[...PLATFORMS, ...customUrls.map(url => ({ id: url, name: url, iconUrl: 'https://cdn.simpleicons.org/googlechrome', color: 'text-secondary/60' } as Platform))]
                        .filter(p => p.id === activePlatform && results[p.id])
                        .map((platform) => {
                          const res = results[platform.id];
                          return (
                            <motion.div
                              key={platform.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="bg-primary rounded-[3rem] border border-secondary/10 overflow-hidden shadow-sm"
                            >
                              <div className="px-10 py-8 bg-neutral border-b border-secondary/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={cn("w-12 h-12 rounded-full bg-primary border border-secondary/10 flex items-center justify-center shadow-sm p-2.5")}>
                                    {platform.icon ? (
                                      <platform.icon className="w-full h-full text-secondary" />
                                    ) : (
                                      <img
                                        src={platform.iconUrl}
                                        alt={platform.name}
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-black text-secondary tracking-tight">{platform.name}</h3>
                                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Platform Specific Adaptation</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => copyAll(platform.id)}
                                  className="p-3.5 bg-primary border border-secondary/10 rounded-full hover:bg-secondary transition-all group relative shadow-sm"
                                  title="Copy All"
                                >
                                  {copiedId === `${platform.id}-all` ? (
                                    <ClipboardCheck className="w-6 h-6 text-neutral" />
                                  ) : (
                                    <Copy className="w-6 h-6 text-secondary/40 group-hover:text-secondary" />
                                  )}
                                </button>
                              </div>

                              <div className="p-10 space-y-10">
                                <div className="relative pl-6">
                                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary rounded-full opacity-20" />
                                  <p className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-3">The Strategy</p>
                                  <p className="text-base text-secondary/80 font-medium leading-relaxed italic">
                                    "{res.explanation}"
                                  </p>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Hook / Headline</label>
                                    <button
                                      onClick={() => copyToClipboard(res.title, `${platform.id}-title`)}
                                      className="text-[10px] font-black text-secondary/40 hover:text-secondary transition-colors flex items-center gap-2 uppercase tracking-widest"
                                    >
                                      {copiedId === `${platform.id}-title` ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                                      {copiedId === `${platform.id}-title` ? 'COPIED' : 'COPY'}
                                    </button>
                                  </div>
                                  <div className="p-6 bg-neutral border border-secondary/10 rounded-[2.5rem] font-black text-secondary text-xl leading-tight shadow-inner">
                                    {res.title}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Body Copy</label>
                                    <button
                                      onClick={() => copyToClipboard(res.description, `${platform.id}-desc`)}
                                      className="text-[10px] font-black text-secondary/40 hover:text-secondary transition-colors flex items-center gap-2 uppercase tracking-widest"
                                    >
                                      {copiedId === `${platform.id}-desc` ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                                      {copiedId === `${platform.id}-desc` ? 'COPIED' : 'COPY'}
                                    </button>
                                  </div>
                                  <div className="markdown-body prose prose-invert max-w-none p-8 bg-neutral border border-secondary/10 rounded-[2.5rem] text-base text-secondary/80 leading-relaxed shadow-inner">
                                    <Markdown>{res.description}</Markdown>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Keywords & Tags</label>
                                    <button
                                      onClick={() => copyToClipboard(res.tags, `${platform.id}-tags`)}
                                      className="text-[10px] font-black text-secondary/40 hover:text-secondary transition-colors flex items-center gap-2 uppercase tracking-widest"
                                    >
                                      {copiedId === `${platform.id}-tags` ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                                      {copiedId === `${platform.id}-tags` ? 'COPIED' : 'COPY'}
                                    </button>
                                  </div>
                                  <div className="p-5 bg-secondary text-neutral rounded-full px-8 text-xs font-mono font-bold tracking-tight shadow-lg shadow-secondary/10">
                                    {res.tags}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="space-y-8">
                    {[...PLATFORMS, ...customUrls.map(url => ({ id: url, name: url, iconUrl: 'https://cdn.simpleicons.org/googlechrome', color: 'text-secondary/60' } as Platform))]
                      .filter(p => results[p.id])
                      .map((platform) => {
                        const res = results[platform.id];
                        return (
                          <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary rounded-[3rem] border border-secondary/10 overflow-hidden shadow-sm"
                          >
                            <div className="px-8 py-6 bg-neutral border-b border-secondary/10 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={cn("w-10 h-10 rounded-full bg-primary border border-secondary/10 flex items-center justify-center shadow-sm p-2")}>
                                  {platform.icon ? (
                                    <platform.icon className="w-full h-full text-secondary" />
                                  ) : (
                                    <img
                                      src={platform.iconUrl}
                                      alt={platform.name}
                                      className="w-full h-full object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                </div>
                                <h3 className="text-lg font-black text-secondary tracking-tight">{platform.name}</h3>
                              </div>
                              <button
                                onClick={() => copyAll(platform.id)}
                                className="p-2.5 bg-primary border border-secondary/10 rounded-full hover:bg-secondary transition-all group relative"
                              >
                                {copiedId === `${platform.id}-all` ? (
                                  <ClipboardCheck className="w-5 h-5 text-neutral" />
                                ) : (
                                  <Copy className="w-5 h-5 text-secondary/40 group-hover:text-secondary" />
                                )}
                              </button>
                            </div>
                            <div className="p-8 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                  <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Hook</label>
                                  <div className="p-5 bg-neutral border border-secondary/5 rounded-[2rem] font-bold text-secondary text-base leading-tight">
                                    {res.title}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Strategy</label>
                                  <p className="text-sm text-secondary/60 italic leading-relaxed">
                                    {res.explanation}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">Copy</label>
                                <div className="markdown-body prose prose-invert max-w-none p-6 bg-neutral border border-secondary/5 rounded-[2rem] text-sm text-secondary/80 leading-relaxed">
                                  <Markdown>{res.description}</Markdown>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                )}
              </motion.div>
            ) : isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[700px] flex flex-col items-center justify-center text-center p-16 bg-primary rounded-[4rem] border border-secondary/10 shadow-sm"
              >
                <div className="relative mb-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-4 border-secondary/5 border-t-secondary rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-secondary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-secondary mb-4 tracking-tighter">Adapting Your Message</h3>
                <p className="text-secondary/60 max-w-sm leading-relaxed text-lg font-medium">
                  Our AI is currently analyzing your core message and tailoring it for each selected platform...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[700px] flex flex-col items-center justify-center text-center p-16 bg-primary rounded-[4rem] border-4 border-dashed border-secondary/5"
              >
                <div className="w-32 h-32 bg-neutral rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <Zap className="w-12 h-12 text-secondary/20" />
                </div>
                <h3 className="text-3xl font-black text-secondary mb-4 tracking-tighter">Ready to Adapt</h3>
                <p className="text-secondary/60 max-w-xs leading-relaxed text-lg font-medium">
                  Fill in your product details on the left and select your target platforms to generate expert marketing copy.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ToolPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolContent />
    </Suspense>
  );
}
