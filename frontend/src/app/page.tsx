'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, Video, Download, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [useNanoBanana, setUseNanoBanana] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    setVideoUrl('');
    setStatus('Ideating script...');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/generate`, { prompt, useNanoBanana });
      setVideoUrl(response.data.videoUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please check if your backend is running and API keys are set.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-8"
      >
        <header className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Vivi-AI</h1>
          </motion.div>
          <p className="text-gray-400 text-lg">Turn your imagination into cinematic short videos instantly.</p>
        </header>

        <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Describe your video scene</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with flying cars at sunset, cinematic lighting..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none text-lg"
              />
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                checked={useNanoBanana}
                onChange={(e) => setUseNanoBanana(e.target.checked)}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-purple-300">Use Nano Banana (AI Images)</span>
                <span className="text-xs text-gray-400">Generates unique visuals instead of pulling from Pexels</span>
              </div>
            </label>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                loading || !prompt 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_25px_rgba(147,51,234,0.4)] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Video
                </>
              )}
            </button>
          </div>
        </section>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 text-red-400"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-12 space-y-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-purple-500 rounded-full animate-spin" />
              </div>
              <p className="text-gray-400 animate-pulse">{status || 'Creating magic...'}</p>
            </motion.div>
          )}

          {videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video relative group">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Your video is ready!</span>
                </div>
                <a 
                  href={videoUrl} 
                  download="vivi-ai-video.mp4"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="pt-12 text-center">
          <p className="text-sm text-gray-500">© 2026 Vivi-AI • Powered by OpenAI, ElevenLabs & Pexels</p>
        </footer>
      </motion.div>
    </div>
  );
}
