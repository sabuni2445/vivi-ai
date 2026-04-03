
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Video, 
  Download, 
  Sparkles, 
  Plus, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRight,
  Globe,
  Settings,
  Layout,
  Library,
  Zap,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  Clock,
  Search,
  MoreVertical,
  User,
  TrendingUp,
  Clock3,
  Waves,
  Heart,
  Eye,
  Share2,
  MessageSquare,
  Home as HomeIcon
} from 'lucide-react';
import { Language, translations } from '@/lib/translations';

// Sample Data for AI Videos Section
const sampleVideos = [
  { id: 1, title: 'Steaming Artisan Coffee', desc: 'Cafe & Bakery', category: 'food', thumb: '/images/food.png', views: '1.2k', heart: 124 },
  { id: 2, title: 'Luxury Steakhouse', desc: 'Fine Dining', category: 'restaurants', thumb: '/images/restaurant.png', views: '840', heart: 98 },
  { id: 3, title: 'Cyberpunk Fashion', desc: 'Modern Collection', category: 'fashion', thumb: '/images/fashion.png', views: '3.1k', heart: 420 },
  { id: 4, title: 'Intense Workout', desc: 'Health & Wellness', category: 'fitness', thumb: '/images/fitness.png', views: '2.4k', heart: 315 },
  { id: 5, title: 'Modern Glass Estate', desc: 'Luxury Residential', category: 'realEstate', thumb: '/images/real_estate.png', views: '1.8k', heart: 210 },
  { id: 6, title: 'Gourmet Burger Flip', desc: 'Quick Service', category: 'food', thumb: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800', views: '1.5k', heart: 180 },
];

const dashboardStats = [
  { label: 'Total Videos', value: '24', icon: <Video className="w-4 h-4" />, change: '+12%' },
  { label: 'Time Saved', value: '180h', icon: <Clock3 className="w-4 h-4" />, change: '+45%' },
  { label: 'Avg Engagement', value: '8.4%', icon: <TrendingUp className="w-4 h-4" />, change: '+2.1%' },
];

export default function Home() {
  const [lang, setLang] = useState<Language>('am');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // App routing state: landing -> application (dashboard/create/result)
  const [view, setView] = useState<'landing' | 'app'>('landing');

  // App workspace states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'library'>('dashboard');
  const [mode, setMode] = useState<'guided' | 'prompt'>('guided');
  const [step, setStep] = useState<'idle' | 'forming' | 'loading' | 'result'>('idle');
  const [activeCategory, setActiveCategory] = useState('all');
  const [progressStep, setProgressStep] = useState(0);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  
  const T = translations[lang];

  const categories = [
    { id: 'all', label: lang === 'am' ? 'ሁሉም' : 'All' },
    { id: 'food', label: T.categories?.food || 'Food' },
    { id: 'restaurants', label: T.categories?.restaurants || 'Restaurants' },
    { id: 'fashion', label: T.categories?.fashion || 'Fashion' },
    { id: 'fitness', label: T.categories?.fitness || 'Fitness' },
    { id: 'realEstate', label: T.categories?.realEstate || 'Real Estate' },
  ];

  const filteredVideos = activeCategory === 'all' 
    ? sampleVideos 
    : sampleVideos.filter(v => v.category === activeCategory);

  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    product: '',
    style: 'Modern',
    platform: 'Instagram',
    description: ''
  });

  const loadingMessages = [
    T.generating.analyzing,
    T.generating.enhancing,
    T.generating.visuals,
    T.generating.finalizing
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('vivi-pro-theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vivi-pro-theme', theme);
  }, [theme]);

  const handleFormSubmit = () => {
    let finalPrompt = '';
    if (mode === 'guided') {
      finalPrompt = `${form.product} for ${form.businessName} (${form.businessType}). ${form.description}`;
    } else {
      finalPrompt = originalPrompt;
    }
    
    setOriginalPrompt(finalPrompt);
    setEnhancedPrompt(`Cinematic high-detail video of ${finalPrompt}. Dramatic lighting, professional camera work, optimized for ${form.platform}.`);
    setStep('loading');
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < 3) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 2500);

    setTimeout(() => {
      setStep('result');
      clearInterval(interval);
    }, 10000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white relative overflow-hidden">
        {/* Ambient Landing Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] bg-primary-glow rounded-full blur-[120px] -z-10 pointer-events-none opacity-50 animate-mesh" />

        {/* Top Navbar */}
        <nav className="absolute top-0 left-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 primary-btn rounded-xl flex items-center justify-center text-white vivid-glow shadow-[0_0_20px_var(--primary-glow)]">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">VIVI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted">
              <span className="hover:text-foreground cursor-pointer transition-colors">Features</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Use Cases</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Pricing</span>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')} className="text-sm font-bold text-muted hover:text-foreground transition-colors mr-2">
                {lang === 'am' ? 'Eng' : 'አማ'}
              </button>
              <button 
                onClick={() => setView('app')}
                className="hidden md:block text-sm font-bold hover:text-primary transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => setView('app')}
                className="primary-btn px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_var(--primary-glow)] hover:scale-105 transition-all"
              >
                Start for Free
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-md text-sm font-bold text-primary mb-4">
              <Sparkles className="w-4 h-4 fill-current" /> Seedance 2.0 Video Engine Live
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.04em] leading-[1.1]">
              Make great videos by <br className="hidden md:block"/> chatting with AI.
            </h1>
            <p className="text-xl md:text-2xl text-muted font-medium max-w-2xl mx-auto leading-relaxed">
              If you can text, you can create. Turn your best ideas into video reality without touching a single complex tool.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setView('app')}
                className="primary-btn px-10 py-5 rounded-full text-xl font-bold flex items-center gap-3 vivid-glow hover:scale-105 transition-all shadow-[0_0_30px_var(--primary-glow)] w-full sm:w-auto"
              >
                Start Creating Free <ChevronRight className="w-6 h-6" />
              </button>
              <button className="px-10 py-5 rounded-full text-xl font-bold flex items-center gap-3 border border-border hover:bg-accent transition-all w-full sm:w-auto">
                <Play className="w-6 h-6" /> View Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-24 relative aspect-video rounded-[40px] overflow-hidden border border-border shadow-[0_40px_100px_-20px_var(--primary-glow)] group cursor-pointer"
          >
            <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <Play className="w-10 h-10 text-white fill-current ml-2" />
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              alt="Medeo Style Interface preview"
            />
          </motion.div>
        </section>

        {/* Value Props Section */}
        <section className="py-32 px-6 bg-card border-t border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-glow rounded-full blur-[150px] pointer-events-none opacity-30 mix-blend-screen" />
          <div className="max-w-7xl mx-auto space-y-24">
            
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-[-0.04em]">Real Talk, <span className="text-primary">Reel Gold.</span></h2>
              <p className="text-xl text-muted font-medium">One platform for every need. Create marketing ads, educational explainers, and animated shorts seamlessly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="high-end-card p-8 space-y-6 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold">Chat-based Creation</h3>
                 <p className="text-muted leading-relaxed font-medium">If you can text, you can create. Turn your best ideas into video reality without touching a single complex tool.</p>
               </div>
               <div className="high-end-card p-8 space-y-6 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <RefreshCw className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold">Chat-based Editing</h3>
                 <p className="text-muted leading-relaxed font-medium">Edit like chatting with a real person. Say "Make this part faster" and the video updates instantly.</p>
               </div>
               <div className="high-end-card p-8 space-y-6 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <User className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold">Character Consistency</h3>
                 <p className="text-muted leading-relaxed font-medium">Lock your character's identity. Generate them in new locations, actions, and emotions automatically.</p>
               </div>
               <div className="high-end-card p-8 space-y-6 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <Layout className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-bold">All-Purpose Hub</h3>
                 <p className="text-muted leading-relaxed font-medium">From high-converting marketing ads to cinematic explainer shorts, generate any format natively.</p>
               </div>
            </div>

          </div>
        </section>

        {/* Action Bottom */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-6xl font-extrabold tracking-[-0.04em] pb-[10px]">Chat it. <span className="text-primary">Clip it.</span></h2>
            <p className="text-2xl text-muted font-medium mb-12">Join thousands of creators producing studio-grade content.</p>
            <button 
                onClick={() => setView('app')}
                className="primary-btn px-12 py-6 rounded-full text-2xl font-bold inline-flex items-center gap-3 vivid-glow hover:scale-105 transition-all shadow-[0_0_40px_var(--primary-glow)]"
              >
                Start for Free <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>
        
        {/* Simple Footer */}
        <footer className="border-t border-border py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted font-medium">
             <div className="flex items-center gap-3">
              <div className="w-8 h-8 primary-btn rounded-lg flex items-center justify-center text-white vivid-glow">
                <Video className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight">VIVI INC.</span>
            </div>
            <div className="flex gap-6">
              <span className="cursor-pointer hover:text-foreground">Discord</span>
              <span className="cursor-pointer hover:text-foreground">Twitter</span>
              <span className="cursor-pointer hover:text-foreground">Privacy Policy</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // APP WORKSPACE VIEW (Dashboard / Create / Result)
  return (
    <div className="flex bg-background text-foreground min-h-screen font-sans selection:bg-primary selection:text-white">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="mesh-decorator animate-mesh" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-sidebar/50 backdrop-blur-xl flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-4 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 primary-btn rounded-2xl flex items-center justify-center text-white vivid-glow">
            <Video className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">VIVI <span className="text-primary">STUDIO</span></span>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <button onClick={() => {setActiveTab('dashboard'); setStep('idle');}} className={`w-full sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <Layout className="w-5 h-5" /> {lang === 'am' ? 'ዳሽቦርድ' : 'Dashboard'}
          </button>
          <button onClick={() => setActiveTab('library')} className={`w-full sidebar-item ${activeTab === 'library' ? 'active' : ''}`}>
            <Library className="w-5 h-5" /> {lang === 'am' ? 'የእኔ ስራዎች' : 'Studio Assets'}
          </button>
          <button className="w-full sidebar-item">
            <TrendingUp className="w-5 h-5" /> Analytics
          </button>
          <button className="w-full sidebar-item">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="p-6 border-t border-border space-y-6">
            <div className="flex bg-accent/30 p-4 rounded-2xl border border-border/50">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <User className="w-5 h-5" />
               </div>
               <div className="ml-3 flex-1 text-sm overflow-hidden">
                 <p className="font-bold truncate">Premium Creator</p>
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-muted text-xs truncate">Pro Account</p>
                 </div>
               </div>
            </div>
            <button 
              onClick={() => {setActiveTab('create'); setStep('forming');}}
              className="w-full primary-btn py-4 rounded-2xl font-bold flex items-center justify-center gap-3 text-lg vivid-glow shadow-[0_0_20px_var(--primary-glow)]"
            >
              <Plus className="w-6 h-6" /> {lang === 'am' ? 'አዲስ ቪዲዮ' : 'New Project'}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Modern Header */}
        <header className="h-20 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-50">
           <div className="flex items-center gap-6 flex-1">
             <div className="relative max-w-lg w-full group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  placeholder={lang === 'am' ? 'ፕሮጀክቶችን ወይም ሞዴሎችን ፈልግ...' : 'Search projects, templates...'} 
                  className="w-full bg-accent/50 border border-border/50 rounded-2xl py-3 pl-12 pr-6 text-sm transition-all focus:ring-1 focus:ring-primary focus:bg-accent focus:outline-none"
               />
             </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
                className="px-4 py-2 rounded-xl bg-accent/50 hover:bg-accent border border-border/50 transition-all text-xs font-bold flex items-center gap-2 group"
              >
                <Globe className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                {lang === 'am' ? 'English' : 'አማርኛ'}
              </button>
              <div className="h-6 w-[1px] bg-border mx-2" />
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 rounded-xl bg-accent/50 hover:bg-accent border border-border/50 transition-all text-muted hover:text-primary"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
           </div>
        </header>

        {/* Dynamic Studio Workspace */}
        <main className="flex-1 p-10 relative">
           <AnimatePresence mode="wait">
             
             {/* DASHBOARD: High-Growth Overview */}
             {activeTab === 'dashboard' && step === 'idle' && (
               <motion.div 
                 key="dashboard"
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 exit="hidden"
                 className="space-y-12"
               >
                 {/* Header & Stats */}
                 <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-end">
                   <div className="xl:col-span-7 space-y-2">
                     <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{lang === 'am' ? 'መልካም ቀን' : 'Hello Expert,'}</h1>
                     <p className="text-xl text-muted font-medium">{lang === 'am' ? 'ለንግድዎ ምርጥ ቪዲዮዎችን ዛሬ ይፍጠሩ' : 'Your video production is running at optimal capacity.'}</p>
                   </div>
                   <div className="xl:col-span-5 grid grid-cols-3 gap-4">
                      {dashboardStats.map((stat, i) => (
                        <div key={i} className="high-end-card p-4 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">{stat.icon}</div>
                            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">{stat.change}</span>
                          </div>
                          <p className="text-xl font-extrabold">{stat.value}</p>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-muted">{stat.label}</p>
                        </div>
                      ))}
                   </div>
                 </div>

                 {/* Creation Hub */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                   <motion.div 
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     onClick={() => {setActiveTab('create'); setStep('forming'); setMode('guided');}}
                     className="high-end-card p-10 flex flex-col items-start gap-6 cursor-pointer relative overflow-hidden group bg-card"
                   >
                      <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white vivid-glow group-hover:scale-110 transition-transform">
                        <Zap className="w-8 h-8 fill-current" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{T.form.mode1}</h3>
                        <p className="text-muted leading-relaxed font-medium">The AI smart-form logic allows for instant business branding with high conversion rates.</p>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold text-sm mt-auto">
                        Start Building <ChevronRight className="w-4 h-4" />
                      </div>
                   </motion.div>

                   <motion.div 
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     onClick={() => {setActiveTab('create'); setStep('forming'); setMode('prompt');}}
                     className="high-end-card p-10 flex flex-col items-start gap-6 cursor-pointer relative overflow-hidden group bg-card"
                   >
                      <div className="w-16 h-16 rounded-[24px] bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{T.form.mode2}</h3>
                        <p className="text-muted leading-relaxed font-medium">Direct neural prompting for cinematic masterpieces and experimental visual storytelling.</p>
                      </div>
                      <div className="flex items-center gap-2 text-orange-500 font-bold text-sm mt-auto">
                        Create with Prompt <ChevronRight className="w-4 h-4" />
                      </div>
                   </motion.div>
                 </div>

                 {/* Media Archive */}
                 <div className="space-y-8 pt-8">
                   <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-extrabold tracking-tight">{T.samples}</h2>
                     <div className="flex bg-accent/50 p-1 rounded-xl">
                        {categories.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => setActiveCategory(c.id)} 
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeCategory === c.id ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
                          >
                            {c.label}
                          </button>
                        ))}
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {filteredVideos.map(v => (
                        <motion.div 
                          key={v.id} 
                          variants={itemVariants}
                          className="high-end-card group overflow-hidden border-border"
                        >
                           <div className="aspect-video relative overflow-hidden bg-accent">
                             <img src={v.thumb} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={v.title} />
                             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all gap-4">
                               <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-2xl scale-50 group-hover:scale-100 transition-all duration-300">
                                 <Play className="w-6 h-6 fill-current ml-1" />
                               </div>
                               <button className="px-6 py-2 rounded-full border border-white/20 text-white text-xs font-bold hover:bg-white hover:text-black transition-all">
                                 Project Details
                               </button>
                             </div>
                             <div className="absolute bottom-3 left-3 flex gap-2">
                               <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white flex items-center gap-1">
                                 <Eye className="w-2.5 h-2.5" /> {v.views}
                               </div>
                               <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white flex items-center gap-1">
                                 <Heart className="w-2.5 h-2.5" /> {v.heart}
                               </div>
                             </div>
                           </div>
                           <div className="p-5 flex items-center justify-between bg-card/80 backdrop-blur-md">
                              <div className="overflow-hidden">
                                <h4 className="font-bold truncate text-lg">{v.title}</h4>
                                <p className="text-xs text-muted font-medium">{v.desc}</p>
                              </div>
                              <div className="p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer text-muted hover:text-primary">
                                <Share2 className="w-4 h-4" />
                              </div>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                 </div>
               </motion.div>
             )}

             {/* CREATE: Advanced Studio Parameters */}
             {activeTab === 'create' && step === 'forming' && (
                <motion.div 
                  key="forming"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="max-w-4xl mx-auto space-y-10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setActiveTab('dashboard')} className="p-3 rounded-2xl bg-accent/50 hover:bg-accent transition-all text-primary border border-border/50">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <h1 className="text-3xl font-extrabold tracking-tight">{lang === 'am' ? 'አዲስ ፕሮጀክት' : 'Initialize Studio'}</h1>
                    </div>
                    <div className="hidden md:flex gap-1.5 p-1 bg-accent/50 rounded-xl border border-border/50">
                       <button onClick={() => setMode('guided')} className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all ${mode === 'guided' ? 'bg-card text-primary shadow-sm' : 'text-muted'}`}>{T.form.mode1}</button>
                       <button onClick={() => setMode('prompt')} className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all ${mode === 'prompt' ? 'bg-card text-primary shadow-sm' : 'text-muted'}`}>{T.form.mode2}</button>
                    </div>
                  </div>

                  <div className="high-end-card p-10 space-y-10 border-border shadow-2xl relative overflow-hidden bg-card">                    
                    {mode === 'guided' ? (
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-bold uppercase text-muted tracking-widest">{T.form.businessName}</label>
                             <input type="text" value={form.businessName} onChange={(e) => setForm({...form, businessName: e.target.value})} className="w-full bg-accent/50 border border-border/30 rounded-2xl p-4 text-sm font-medium transition-all focus:ring-1 focus:ring-primary focus:bg-accent focus:outline-none" placeholder="e.g. Skyline Media" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-bold uppercase text-muted tracking-widest">{T.form.businessType}</label>
                             <input type="text" value={form.businessType} onChange={(e) => setForm({...form, businessType: e.target.value})} className="w-full bg-accent/50 border border-border/30 rounded-2xl p-4 text-sm font-medium transition-all focus:ring-1 focus:ring-primary focus:bg-accent focus:outline-none" placeholder="e.g. Creative Agency" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-bold uppercase text-muted tracking-widest">{T.form.product}</label>
                             <input type="text" value={form.product} onChange={(e) => setForm({...form, product: e.target.value})} className="w-full bg-accent/50 border border-border/30 rounded-2xl p-4 text-sm font-medium transition-all focus:ring-1 focus:ring-primary focus:bg-accent focus:outline-none" placeholder="e.g. Virtual Showroom" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-bold uppercase text-muted tracking-widest">{T.form.style}</label>
                             <select value={form.style} onChange={(e) => setForm({...form, style: e.target.value})} className="w-full bg-accent/50 border border-border/30 rounded-2xl p-4 text-sm font-medium transition-all focus:ring-1 focus:ring-primary focus:bg-accent focus:outline-none appearance-none">
                               {T.styles.map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                          </div>
                       </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase text-muted tracking-widest">{T.form.promptLabel}</label>
                        <textarea 
                          value={originalPrompt} 
                          onChange={(e) => setOriginalPrompt(e.target.value)}
                          className="w-full bg-accent/50 border border-border/30 rounded-3xl p-8 text-lg font-medium min-h-[250px] transition-all focus:ring-1 focus:ring-primary focus:bg-accent focus:outline-none resize-none"
                          placeholder={T.form.promptPlaceholder}
                        />
                      </div>
                    )}

                    <button 
                      onClick={handleFormSubmit} 
                      className="w-full primary-btn py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 vivid-glow"
                      disabled={mode === 'prompt' ? !originalPrompt : !form.businessName}
                    >
                       <Zap className="w-6 h-6 fill-current" /> {T.ctaGenerate}
                    </button>
                  </div>
                </motion.div>
             )}

             {/* LOADING: Cinematic Synthesis */}
             {step === 'loading' && (
               <motion.div 
                 key="loading"
                 className="h-full flex flex-col items-center justify-center space-y-12"
               >
                 <div className="w-40 h-40 relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <svg className="w-full h-full overflow-visible">
                      <motion.circle 
                         cx="80" cy="80" r="70" 
                         stroke="var(--primary)" strokeWidth="6" fill="none"
                         strokeDasharray="440"
                         initial={{ strokeDashoffset: 440 }}
                         animate={{ strokeDashoffset: 440 - (progressStep + 1) * 110 }}
                         strokeLinecap="round"
                         className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Zap className="w-12 h-12 text-primary animate-bounce" />
                    </div>
                 </div>
                 <div className="text-center space-y-4 max-w-sm">
                    <h2 className="text-3xl font-extrabold tracking-tight">{loadingMessages[progressStep]}</h2>
                    <p className="text-muted font-medium italic opacity-60 leading-relaxed">Scaling neural parameters to achieve investor-grade cinematic output...</p>
                 </div>
               </motion.div>
             )}

             {/* FINAL: Professional Studio Output */}
             {step === 'result' && (
               <motion.div 
                 key="result"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8"
               >
                 <div className="lg:col-span-8 space-y-8">
                    <div className="aspect-video bg-black rounded-[32px] overflow-hidden border border-border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative group cursor-pointer">
                       <video src="https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4" controls autoPlay loop className="w-full h-full object-cover" />
                       <div className="absolute top-6 left-6 p-1.5 bg-primary rounded-lg text-white font-bold text-[10px] uppercase tracking-widest shadow-lg">AI Studio Master</div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                       <div className="space-y-1">
                         <h1 className="text-3xl font-extrabold tracking-tight">{T.results.ready}</h1>
                         <div className="flex items-center gap-3 text-muted text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Fully Optimized for Premium Distibution
                         </div>
                       </div>
                       <div className="flex gap-4 w-full md:w-auto">
                          <button className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-accent p-2 border border-border hover:bg-accent transition-all font-bold flex items-center justify-center gap-3">
                            <Share2 className="w-5 h-5" /> Share
                          </button>
                          <button className="flex-1 md:flex-none primary-btn px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 vivid-glow shadow-[0_0_20px_var(--primary-glow)]">
                            <Download className="w-5 h-5" /> {T.results.download}
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-6">
                    <div className="high-end-card p-8 space-y-10 border-border shadow-xl bg-card">
                       <div className="space-y-3">
                         <p className="text-[10px] uppercase font-extrabold text-muted tracking-widest flex items-center gap-2">
                           <Library className="w-3 h-3" /> Studio Input
                         </p>
                         <div className="bg-accent/40 border border-border/50 p-4 rounded-2xl text-sm italic font-medium leading-relaxed font-serif">"{originalPrompt}"</div>
                       </div>
                       
                       <div className="h-[1px] bg-border/50" />

                       <div className="space-y-3">
                         <p className="text-[10px] uppercase font-extrabold text-primary tracking-widest flex items-center gap-2">
                           <Sparkles className="w-3 h-3" /> Enhanced Parameters
                         </p>
                         <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-sm leading-relaxed font-medium text-foreground/80">{enhancedPrompt}</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       <button onClick={() => setStep('forming')} className="px-6 py-4 rounded-2xl border border-border font-extrabold hover:bg-accent transition-all flex items-center justify-center gap-3 bg-card">
                         <RefreshCw className="w-5 h-5" /> Re-Synthesize Visuals
                       </button>
                       <button onClick={() => {setStep('idle'); setActiveTab('dashboard');}} className="px-6 py-4 rounded-2xl border border-border font-extrabold hover:bg-accent transition-all flex items-center justify-center gap-3 bg-card text-muted">
                         <HomeIcon className="w-5 h-5" /> Dashboard
                       </button>
                    </div>
                 </div>
               </motion.div>
             )}

           </AnimatePresence>
        </main>
      </div>
      
    </div>
  );
}
