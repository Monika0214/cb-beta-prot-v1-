
import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import Loading from '../common/Loading';

const ImageTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const url = await generateImage(prompt, aspectRatio);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
      alert("Error generating image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Image Synthesis</h1>
        <p className="text-slate-400">Bring your imagination to life with high-fidelity image generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300">Prompt Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying neon cars and purple skies..."
              className="w-full h-32 p-4 bg-slate-900 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {(["1:1", "16:9", "9:16"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 rounded-lg border transition-all text-xs font-bold ${
                    aspectRatio === ratio 
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                    : 'border-white/5 bg-slate-900 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20"
          >
            {loading ? 'Synthesizing...' : 'Create Image'}
          </button>
        </div>

        <div className="md:col-span-2 min-h-[400px] flex items-center justify-center bg-slate-900/50 border-2 border-dashed border-white/5 rounded-2xl relative overflow-hidden group">
          {loading ? (
            <Loading />
          ) : imageUrl ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img src={imageUrl} alt="Generated" className="max-w-full max-h-full rounded-lg shadow-2xl transition-transform hover:scale-[1.02]" />
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={imageUrl} 
                  download="nexus-studio-gen.png"
                  className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-black/80 transition-colors"
                >
                  <i className="fa-solid fa-download"></i>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 p-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                <i className="fa-solid fa-image text-2xl text-slate-500"></i>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Your generated masterpiece will appear here</p>
                <p className="text-slate-600 text-sm">Enter a prompt and click "Create Image" to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageTool;
