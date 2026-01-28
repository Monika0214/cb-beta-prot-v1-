
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-800 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0 shadow-lg shadow-blue-500/20"></div>
      </div>
      <p className="text-slate-500 text-sm font-medium tracking-widest uppercase animate-pulse">Processing</p>
    </div>
  );
};

export default Loading;
