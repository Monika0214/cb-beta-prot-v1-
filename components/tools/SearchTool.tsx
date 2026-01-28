
import React, { useState } from 'react';
import { searchGrounding } from '../../services/geminiService';
import { SearchCitation } from '../../types';
import Loading from '../common/Loading';

const SearchTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; citations: SearchCitation[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchGrounding(query);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Nexus Search</h1>
        <p className="text-slate-400">Search with AI-powered grounding for real-time accurate information.</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i className="fa-solid fa-magnifying-glass text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full pl-12 pr-32 py-5 bg-slate-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-xl"
          placeholder="What's happening in the world today?"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-sm transition-all"
        >
          {loading ? 'Scanning...' : 'Search'}
        </button>
      </div>

      {loading && <Loading />}

      {result && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
             <div className="p-8 bg-slate-900/50 border border-white/5 rounded-2xl glass-panel">
               <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                 {result.text}
               </div>
             </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
             <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl glass-panel">
               <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <i className="fa-solid fa-link"></i> Sources
               </h3>
               {result.citations.length > 0 ? (
                 <div className="flex flex-col gap-3">
                   {result.citations.map((chunk, idx) => (
                     chunk.web && (
                       <a 
                         key={idx} 
                         href={chunk.web.uri} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                       >
                         <div className="text-xs font-bold text-slate-200 line-clamp-1 mb-1 group-hover:text-emerald-400 transition-colors">
                            {chunk.web.title || "External Resource"}
                         </div>
                         <div className="text-[10px] text-slate-500 truncate">
                            {chunk.web.uri}
                         </div>
                       </a>
                     )
                   ))}
                 </div>
               ) : (
                 <p className="text-slate-500 text-sm italic">No specific grounding links provided for this response.</p>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTool;
