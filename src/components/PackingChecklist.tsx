import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, CheckSquare, Square, Trash2, Tag, ShoppingBag } from 'lucide-react';
import { SectionHeader, Card, Button } from './Theme';
import { Trip, ChecklistItem } from '../types';
import { checklistService } from '../services/checklistService';
import { cn } from '../lib/utils';

interface PackingChecklistProps {
  trips: Trip[];
}

export function PackingChecklist({ trips }: PackingChecklistProps) {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (selectedTripId) {
      const unsub = checklistService.subscribeToChecklist(selectedTripId, setItems);
      return unsub;
    }
  }, [selectedTripId]);

  const handleAddItem = async (e: React.MouseEvent | React.FormEvent | null, category: string) => {
    if (e) e.preventDefault();
    if (!newItemText || !selectedTripId) return;
    await checklistService.addItem({
      tripId: selectedTripId,
      text: newItemText,
      category: category
    });
    setNewItemText('');
  };

  const toggleItem = async (item: ChecklistItem) => {
    await checklistService.updateItem(selectedTripId, item.id, !item.completed);
  };

  const deleteItem = async (itemId: string) => {
    await checklistService.deleteItem(selectedTripId, itemId);
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const categories = ['Documents', 'Clothing', 'Electronics', 'Misc'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SectionHeader 
        title="Packing List" 
        subtitle="Organized by category to ensure nothing is missed."
        action={
          <select 
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-4 py-3 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-orange-500 bg-white"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        }
      />

      <div className="space-y-10">
        <Card className="bg-[#141414] text-white border-none p-10 flex flex-col md:flex-row items-center gap-10">
           <div className="text-center md:text-left">
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Readiness Score</p>
              <p className="text-6xl font-black">{Math.round(progress)}%</p>
              <p className="text-slate-400 text-sm font-bold mt-4">{completedCount} of {items.length} items packed</p>
           </div>
           <div className="flex-1 w-full space-y-4">
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                />
              </div>
              <p className="text-xs text-slate-500 font-bold italic">"Preparation is the key to a stress-free voyage."</p>
           </div>
        </Card>

        <Card className="p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <input 
              type="text"
              placeholder="What are you bringing?"
              className="flex-1 px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-orange-500 outline-none font-bold transition-all text-lg shadow-inner"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
            />
            <div className="flex gap-2">
              {categories.slice(0, 3).map(cat => (
                <Button key={cat} onClick={() => { handleAddItem(null, cat); }} className="px-6 py-5">Add to {cat}</Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {categories.map(cat => {
              const catItems = items.filter(i => i.category === cat);
              return (
                <div key={cat} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-primary" />
                    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{cat}</h5>
                  </div>
                  <div className="space-y-2">
                    {catItems.length > 0 ? (
                      catItems.map(item => (
                        <div 
                          key={item.id} 
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group",
                            item.completed ? "bg-orange-50 border-orange-100 opacity-60" : "bg-white border-slate-100 hover:border-orange-200"
                          )}
                          onClick={() => toggleItem(item)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                              item.completed ? "bg-orange-500 border-orange-500 shadow-sm" : "border-slate-200"
                            )}>
                              {item.completed && <CheckSquare className="text-white" size={12} />}
                            </div>
                            <span className={cn("font-bold text-sm", item.completed && "line-through text-slate-400")}>
                              {item.text}
                            </span>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                            className="p-1.5 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-300 font-bold italic py-4">No items for this category.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
