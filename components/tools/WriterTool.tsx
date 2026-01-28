
import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Loading from '../common/Loading';

const WriterTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const text = await generateText(prompt, "You are a professional creative writer. Format your output with clear structure and markdown if necessary.");
      setResult(text || "No response generated.");
    } catch (error) {
      console.error(error);
      setResult("Error generating text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Creative Writer</h1>
        <p className="text-slate-400">Craft stories, blogs, or emails with high-precision text generation.</p>
      </div>

      <div className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What should I write today? (e.g., 'Write a sci-fi story about a robot on Mars')"
          className="w-full h-32 p-4 bg-slate-900 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="self-end px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Thinking...' : 'Generate Text'}
        </button>
      </div>

      {loading && <Loading />}

      {result && !loading && (
        <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl glass-panel prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
            {result}
          </div>
          <div className="mt-6 flex justify-end gap-2">
             <button 
               onClick={() => navigator.clipboard.writeText(result)}
               className="p-2 text-slate-400 hover:text-white transition-colors"
               title="Copy to clipboard"
             >
               <i className="fa-solid fa-copy"></i>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriterTool;
