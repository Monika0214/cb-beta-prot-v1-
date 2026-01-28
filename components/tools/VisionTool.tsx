
import React, { useState, useRef } from 'react';
import { analyzeImage } from '../../services/geminiService';
import Loading from '../common/Loading';

const VisionTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await analyzeImage(prompt, image);
      setAnalysis(result || "No analysis generated.");
    } catch (error) {
      console.error(error);
      setAnalysis("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Visual Intelligence</h1>
        <p className="text-slate-400">Analyze images, extract text, or get detailed explanations of any visual content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-80 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
              image ? 'border-amber-500/50' : 'border-white/10 hover:border-amber-500/30 bg-slate-900/50'
            }`}
          >
            {image ? (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white font-bold">Change Image</span>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-amber-500/50 mb-4"></i>
                <p className="text-slate-300 font-semibold">Click to upload image</p>
                <p className="text-slate-500 text-sm mt-1">PNG, JPG or WebP up to 10MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300">Instructions</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 bg-slate-900 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="What do you want to know about this image?"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !image}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/20"
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>

        <div className="flex flex-col bg-slate-900/50 border border-white/5 rounded-2xl glass-panel min-h-[400px]">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">Analysis Results</h3>
            {loading && <div className="w-4 h-4 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>}
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loading />
                <p className="text-slate-500 animate-pulse text-sm">Deconstructing visual data...</p>
              </div>
            ) : analysis ? (
              <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic text-center px-12">
                "Visual intelligence is the ability to interpret and manipulate mental images and perspectives."
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionTool;
