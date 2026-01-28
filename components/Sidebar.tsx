
import React from 'react';
import { AppTool } from '../types';

interface SidebarProps {
  activeTool: AppTool;
  onToolSelect: (tool: AppTool) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onToolSelect }) => {
  const tools = [
    { id: AppTool.WRITER, icon: 'fa-pen-nib', label: 'Write', color: 'from-blue-500 to-cyan-500' },
    { id: AppTool.IMAGEN, icon: 'fa-wand-magic-sparkles', label: 'Imagine', color: 'from-purple-500 to-pink-500' },
    { id: AppTool.VISION, icon: 'fa-eye', label: 'Analyze', color: 'from-amber-500 to-orange-500' },
    { id: AppTool.SEARCH, icon: 'fa-magnifying-glass', label: 'Search', color: 'from-emerald-500 to-teal-500' },
    { id: AppTool.SPEECH, icon: 'fa-volume-high', label: 'Talk', color: 'from-rose-500 to-red-500' },
  ];

  return (
    <aside className="w-20 md:w-64 border-r border-white/5 glass-panel h-full flex flex-col items-center md:items-stretch transition-all">
      <div className="p-6 hidden md:block">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Studio Suite</h2>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2 p-2 md:p-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`group relative flex items-center gap-4 p-3 md:p-4 rounded-xl transition-all duration-300 ${
              activeTool === tool.id 
              ? 'bg-white/10 text-white shadow-lg' 
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} text-white shadow-lg shadow-${tool.id}/20 group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${tool.icon} text-lg`}></i>
            </div>
            <span className="hidden md:block font-medium">{tool.label}</span>
            {activeTool === tool.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 md:p-6 border-t border-white/5">
        <div className="hidden md:block p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-[10px] text-blue-300 uppercase font-bold mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-200">API Connected</span>
          </div>
        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-gear"></i>
          <span className="hidden md:block text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
