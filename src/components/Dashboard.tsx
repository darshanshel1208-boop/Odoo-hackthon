import { motion } from 'motion/react';
import { Plus, Compass, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { SectionHeader, Card, Button } from './Theme';
import { Trip } from '../types';

interface DashboardProps {
  trips: Trip[];
  onPlanNew: () => void;
  onViewTrip: (trip: Trip) => void;
}

export function Dashboard({ trips, onPlanNew, onViewTrip }: DashboardProps) {
  const upcomingTrips = trips
    .filter(t => new Date(t.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const featuredDestinations = [
    { name: 'Tokyo', country: 'Japan', cost: 'High', image: 'https://images.unsplash.com/photo-1540959733332-e94e270b4082?auto=format&fit=crop&q=80&w=400' },
    { name: 'Bali', country: 'Indonesia', cost: 'Low', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=400' },
    { name: 'Paris', country: 'France', cost: 'High', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[520px] rounded-[40px] overflow-hidden shadow-2xl group border border-slate-200"
      >
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1600" 
          alt="Travel Hero" 
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl bg-black/20 backdrop-blur-md p-10 md:p-14 rounded-[32px] border border-white/20 relative overflow-hidden group/inner"
          >
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-[2px] bg-primary" />
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Premium Experience</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.85]">
              Beyond the <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary/50">Known Horizon</span>
            </h2>
            
            <p className="text-white/70 text-lg font-medium mb-12 max-w-lg leading-relaxed">
              Design itineraries that don't just follow the map—they create a story worth telling. Start your journey today.
            </p>
            
            <div className="flex flex-wrap gap-4 relative z-10">
              <Button onClick={onPlanNew} className="rounded-full px-10 py-5 text-base shadow-xl shadow-primary/20" icon={Plus}>Start Designing</Button>
              <Button variant="outline" className="rounded-full px-10 py-5 text-base bg-white/5 text-white border-white/10 backdrop-blur-xl hover:bg-white/20 transition-all">Explore Hotspots</Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <SectionHeader 
        title="Welcome back!" 
        subtitle={`You have ${upcomingTrips.length} upcoming trips this season.`}
        action={
          <Button onClick={onPlanNew} icon={Plus}>+ Plan New Trip</Button>
        }
      />

      {/* Inspiration Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="relative h-72 rounded-[32px] overflow-hidden cursor-pointer shadow-xl group"
        >
          <img 
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt="World Collage" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded">Multi-City</span>
            </div>
            <h4 className="text-white text-3xl font-black tracking-tighter">Plan Like a Pro</h4>
            <p className="text-white/70 font-medium mt-1">Connect the dots across the globe with ease.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="relative h-72 rounded-[32px] overflow-hidden cursor-pointer shadow-xl group"
        >
          <img 
            src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt="Hiking Group" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded">Active</span>
            </div>
            <h4 className="text-white text-3xl font-black tracking-tighter">Wild Encounters</h4>
            <p className="text-white/70 font-medium mt-1">From high peaks to deep valleys, find your trail.</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              Recent Trips
            </h3>
            {upcomingTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingTrips.slice(0, 2).map(trip => (
                  <Card 
                    key={trip.id} 
                    onClick={() => onViewTrip(trip)}
                    className="group !p-0"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      <img 
                        src={trip.coverPhoto || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400`} 
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-800">{trip.name}</h4>
                        <span className="text-emerald-500 text-[10px] font-bold uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs font-medium">
                        {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • 3 Cities
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed bg-transparent shadow-none border-slate-200">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4">
                  <Compass size={24} />
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">No active journeys</p>
                <Button variant="ghost" onClick={onPlanNew} className="mt-2">Start Designing</Button>
              </Card>
            )}
          </div>

          <div className="stat-card bg-white rounded-2xl p-8 border border-border-subtle shadow-sm flex-1">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Itinerary Preview: Amalfi Escape</h3>
            <div className="flex gap-12 overflow-x-auto pb-4">
              <div className="flex-1 min-w-[120px] border-l-2 border-primary pl-4">
                <div className="text-[10px] text-primary font-extrabold uppercase tracking-widest mb-1">DAY 1-3</div>
                <div className="font-bold text-slate-800 mb-1">Positano</div>
                <div className="text-xs text-slate-500 font-medium leading-relaxed">Boat tour & Cliffside dinner</div>
              </div>
              <div className="flex-1 min-w-[120px] border-l-2 border-slate-100 pl-4">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">DAY 4-5</div>
                <div className="font-bold text-slate-800 mb-1">Ravello</div>
                <div className="text-xs text-slate-500 font-medium leading-relaxed">Villa Rufolo Gardens</div>
              </div>
              <div className="flex-1 min-w-[120px] border-l-2 border-slate-100 pl-4">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">DAY 6-8</div>
                <div className="font-bold text-slate-800 mb-1">Capri</div>
                <div className="text-xs text-slate-500 font-medium leading-relaxed">Blue Grotto Expedition</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <Card className="p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Budget Overview</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full border-[6px] border-slate-50 border-t-primary flex items-center justify-center font-bold text-slate-800 text-sm">74%</div>
              <div>
                <p className="text-2xl font-black text-slate-800">$3,420</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estimated Total</p>
              </div>
            </div>
            <div className="space-y-4 border-t border-slate-50 pt-6">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Stay</span>
                <span className="text-slate-800">$1,800</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Transport</span>
                <span className="text-slate-800">$920</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Activities</span>
                <span className="text-slate-800">$700</span>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Packing Checklist</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                <span className="text-emerald-500 shrink-0">✔</span> Passport & Documents
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                <span className="text-emerald-500 shrink-0">✔</span> Camera & Chargers
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <div className="w-3.5 h-3.5 border border-slate-200 rounded-sm shrink-0" /> European Power Adapter
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <div className="w-3.5 h-3.5 border border-slate-200 rounded-sm shrink-0" /> Linen Outfits (4)
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
