import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-zinc-900 border-t border-red-600/50 sm:border-x sm:border-b sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
        style={{ maxHeight: '90dvh' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 pt-[calc(1rem+env(safe-area-inset-top)/2)]">
          <h2 className="heading-font text-2xl font-bold tracking-wider text-red-500">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-zinc-400" />
          </button>
        </div>
        <div className="overflow-y-auto p-4 custom-scrollbar pb-[calc(1rem+env(safe-area-inset-bottom))]" style={{ maxHeight: 'calc(90dvh - 64px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};