import React from "react";
import { motion } from "motion/react";
import { Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ManageCategoriesModalProps {
  categories: string[];
  onClose: () => void;
  onSave: (categories: string[]) => void;
}

export function ManageCategoriesModal({ categories, onClose, onSave }: ManageCategoriesModalProps) {
  const [localCats, setLocalCats] = React.useState([...categories]);
  const [newCat, setNewCat] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (localCats.includes(newCat.trim())) {
      toast.error("Category already exists");
      return;
    }
    setLocalCats([...localCats, newCat.trim()]);
    setNewCat("");
  };

  const handleDelete = (index: number) => {
    setLocalCats(localCats.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(localCats[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (!editValue.trim()) return;
    const updated = [...localCats];
    updated[index] = editValue.trim();
    setLocalCats(updated);
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Purchase Categories</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Classification Taxonomy</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Plus className="rotate-45 text-gray-500" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add new category..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90"
            >
              Add
            </button>
          </form>

          <div className="space-y-2">
            {localCats.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                {editingIndex === index ? (
                  <input 
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveEdit(index)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                    className="flex-1 bg-white border border-primary px-2 py-1 rounded text-sm focus:outline-none"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-700">{cat}</span>
                )}
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEditing(index)}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(index)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <Plus className="rotate-45" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          <button 
            onClick={() => {
              onSave(localCats);
              onClose();
              toast.success("Taxonomy updated");
            }}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 shadow-lg shadow-primary/10"
          >
            Apply Changes
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
