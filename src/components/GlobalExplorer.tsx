import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader, Card, Button } from './Theme';
import { Globe, Plane, Star, ArrowRight, Eye } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: "Kyoto, Japan",
    tagline: "Eternal Tradition",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000",
    description: "Experience the heart of Japanese culture, from golden temples to serene zen gardens and bustling traditional markets.",
    stats: { temp: "22°C", rating: "4.9", flights: "$840" }
  },
  {
    id: 2,
    name: "Santorini, Greece",
    tagline: "Azure Horizons",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1000",
    description: "Iconic white-washed buildings perched on volcanic cliffs overlooking the deep blue Aegean Sea.",
    stats: { temp: "28°C", rating: "4.8", flights: "$1,120" }
  },
  {
    id: 3,
    name: "Swiss Alps",
    tagline: "Glacial Majesty",
    image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=1000",
    description: "Breathtaking landscapes of snow-capped peaks, crystal clear lakes, and charming mountain villages.",
    stats: { temp: "15°C", rating: "5.0", flights: "$950" }
  },
  {
    id: 4,
    name: "Marrakech, Morocco",
    tagline: "The Red City",
    image: "https://images.unsplash.com/photo-1597212618440-8062a4976629?auto=format&fit=crop&q=80&w=1000",
    description: "A sensory explosion of colors, smells, and sounds in the ancient medinas and luxurious riads.",
    stats: { temp: "31°C", rating: "4.7", flights: "$720" }
  }
];

export default function GlobalExplorer() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="space-y-12 pb-20">
      <SectionHeader 
        title="Global Explorer" 
        subtitle="Swipe through the world's most breathtaking 3D perspectives."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {destinations.map((dest) => (
          <motion.div
            key={dest.id}
            whileHover={{ scale: 1.02, rotateY: -5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ perspective: 1000 }}
            className="group relative h-[500px] cursor-pointer"
            onClick={() => setSelectedId(dest.id)}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 rounded-3xl" />
            
            <img 
              src={dest.image} 
              alt={dest.name} 
              className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-110" 
            />

            <div className="absolute bottom-0 left-0 right-0 p-10 z-20 text-white">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Explore</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                    <Star size={10} fill="currentColor" /> {dest.stats.rating}
                  </span>
                </div>
                <h3 className="text-4xl font-black mb-2 tracking-tighter leading-none">{dest.name}</h3>
                <p className="text-white/70 font-medium tracking-wide mb-6">{dest.tagline}</p>
                
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="primary" className="rounded-full px-8" icon={ArrowRight}>
                    View Details
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* 3D Floating Badges */}
            <motion.div 
              className="absolute top-10 left-10 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl hidden md:block"
              whileHover={{ translateZ: 50 }}
            >
              <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Starting from</div>
              <div className="text-xl font-bold text-white">{dest.stats.flights}</div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Destination Overlay */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            {destinations.filter(d => d.id === selectedId).map(dest => (
              <motion.div 
                key={dest.id}
                layoutId={`card-${dest.id}`}
                className="bg-white rounded-[40px] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row h-full md:h-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="md:w-1/2 h-64 md:h-[600px] relative">
                  <img src={dest.image} className="w-full h-full object-cover" alt={dest.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                  <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">{dest.name}</h2>
                  <p className="text-slate-400 text-lg font-bold mb-8 uppercase tracking-widest">{dest.tagline}</p>
                  <p className="text-slate-600 leading-relaxed text-lg mb-10">
                    {dest.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 mb-12">
                    <div className="text-center p-4 bg-slate-50 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Temp</div>
                      <div className="text-lg font-black text-slate-800">{dest.stats.temp}</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Rating</div>
                      <div className="text-lg font-black text-slate-800">{dest.stats.rating}</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-2xl">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Flights</div>
                      <div className="text-lg font-black text-slate-800">{dest.stats.flights}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 py-4 text-lg">Add to Itinerary</Button>
                    <Button variant="outline" onClick={() => setSelectedId(null)}>Close</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-20">
         <Card className="bg-slate-900 border-none p-16 text-center text-white overflow-hidden relative">
            {/* Visual background details */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40">
                <Globe size={40} className="text-white" />
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-4">Ready to see the world?</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-lg mb-12">
                Join over 50,000 voyagers who use Traveloop to design their dream itineraries in high definition.
              </p>
              <Button variant="primary" className="px-12 py-5 text-xl rounded-full" icon={Plane}>
                Launch New Journey
              </Button>
            </div>
         </Card>
      </div>
    </div>
  );
}
