import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HistoryItem {
  id: string;
  image: string;
  prompt: string;
  timestamp: number;
}

interface SessionHistoryProps {
  history: HistoryItem[];
  onSelect: (image: string) => void;
  onDelete: (id: string) => void;
}

export const SessionHistory = ({ history, onSelect, onDelete }: SessionHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full h-32 glass-panel border-t border-white/5 flex items-center px-6 gap-4 overflow-x-auto custom-scrollbar shrink-0">
      <AnimatePresence>
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, width: 0, margin: 0 }}
            className="relative h-24 min-w-[6rem] rounded-xl overflow-hidden group border border-white/10 shrink-0 cursor-pointer"
            onClick={() => onSelect(item.image)}
          >
            <img 
              src={item.image} 
              alt={item.prompt} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
              <p className="text-[10px] text-white/80 text-center line-clamp-2 mb-2">
                {item.prompt || 'Sin prompt'}
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
