import React from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface ManageCategoriesModalProps {
  categories: string[];
  onClose: () => void;
  onSave: (categories: string[]) => void;
}

export function ManageCategoriesModal({ categories, onClose, onSave }: ManageCategoriesModalProps) {
  const [localCats, setLocalCats] = React.useState([...categories]);
  const [newCat, setNewCat] = React.useState("");

  const handleAddCategory = () => {
    if (newCat.trim()) {
      setLocalCats([...localCats, newCat.trim()]);
      setNewCat("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    setLocalCats(localCats.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    onSave(localCats);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Revenue Categories</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Classification Taxonomy</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Plus className="rotate-45 text-gray-500" size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add new category..." 
              value={newCat} 
              onChange={e => setNewCat(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" 
            />
            <button 
              onClick={handleAddCategory} 
              className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest"
            >
              Add
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {localCats.map((cat, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group"
              >
                <span className="text-sm font-semibold text-gray-700">{cat}</span>
                <button 
                  onClick={() => handleRemoveCategory(i)} 
                  className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Plus className="rotate-45" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          <button 
            onClick={handleSave} 
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/10"
          >
            Apply Changes
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
