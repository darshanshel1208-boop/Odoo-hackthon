import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, MapPin, Calendar, Clock, DollarSign, Trash2, ChevronRight, ChevronDown, CheckCircle2, MoreVertical, X, TrendingUp } from 'lucide-react';
import { SectionHeader, Card, Button } from './Theme';
import { Trip, Stop, TripActivity } from '../types';
import { itineraryService } from '../services/itineraryService';
import { cn } from '../lib/utils';

interface ItineraryBuilderProps {
  trip: Trip;
  onBack: () => void;
}

export function ItineraryBuilder({ trip, onBack }: ItineraryBuilderProps) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [activities, setActivities] = useState<TripActivity[]>([]);
  const [expandedStop, setExpandedStop] = useState<string | null>(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStopCity, setNewStopCity] = useState('');
  const [newStopArrival, setNewStopArrival] = useState('');
  const [newStopDeparture, setNewStopDeparture] = useState('');

  const [showAddActivity, setShowAddActivity] = useState<string | null>(null); // stopId
  const [actTitle, setActTitle] = useState('');
  const [actCost, setActCost] = useState('0');

  useEffect(() => {
    const unsubStops = itineraryService.subscribeToStops(trip.id, setStops);
    const unsubActs = itineraryService.subscribeToActivities(trip.id, setActivities);
    return () => {
      unsubStops();
      unsubActs();
    };
  }, [trip.id]);

  const handleAddStop = async () => {
    if (!newStopCity || !newStopArrival || !newStopDeparture) return;
    await itineraryService.addStop({
      tripId: trip.id,
      cityName: newStopCity,
      arrivalDate: newStopArrival,
      departureDate: newStopDeparture,
      order: stops.length,
      country: 'Unknown' // Ideally from a search API
    });
    setNewStopCity('');
    setShowAddStop(false);
  };

  const handleAddActivity = async (stopId: string) => {
    if (!actTitle) return;
    await itineraryService.addActivity({
      tripId: trip.id,
      stopId,
      title: actTitle,
      cost: parseFloat(actCost) || 0,
      order: activities.filter(a => a.stopId === stopId).length
    });
    setActTitle('');
    setActCost('0');
    setShowAddActivity(null);
  };

  const totalBudget = activities.reduce((sum, act) => sum + act.cost, 0);

  return (
    <div className="space-y-8 pb-32">
      <SectionHeader 
        title={trip.name} 
        subtitle={`${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`}
        action={
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold uppercase text-gray-400">Total Budget</p>
              <p className="text-xl font-bold text-orange-600">${totalBudget.toLocaleString()}</p>
            </div>
            <Button variant="outline" onClick={onBack}>Back to Trips</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {stops.map((stop, index) => (
            <div key={stop.id} className="relative">
              {index < stops.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-orange-200 to-transparent z-0" />
              )}
              <Card className={cn(
                "relative z-10 overflow-visible transition-all duration-300",
                expandedStop === stop.id ? "ring-2 ring-orange-100 shadow-xl" : "hover:border-orange-100"
              )}>
                <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">{stop.cityName}</h4>
                      <p className="text-gray-500 flex items-center gap-2 font-medium mt-1">
                        <Calendar size={16} />
                        {new Date(stop.arrivalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                        <ChevronRight size={14} />
                        {new Date(stop.departureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-xs font-bold uppercase text-gray-400">Activities</p>
                       <p className="font-bold">{activities.filter(a => a.stopId === stop.id).length}</p>
                    </div>
                    {expandedStop === stop.id ? <ChevronDown /> : <ChevronRight />}
                  </div>
                </div>

                {expandedStop === stop.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 pt-8 border-t border-gray-100 space-y-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-bold text-gray-400 uppercase tracking-widest text-sm">Activities & Places</h5>
                      <Button variant="ghost" className="text-xs" icon={Plus} onClick={() => setShowAddActivity(stop.id)}>Add Activity</Button>
                    </div>

                    {activities.filter(a => a.stopId === stop.id).map(act => (
                      <div key={act.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                          <div>
                            <p className="font-bold">{act.title}</p>
                            <p className="text-xs text-gray-400 font-medium">Estimated cost: ${act.cost}</p>
                          </div>
                        </div>
                        <button onClick={() => itineraryService.deleteActivity(trip.id, act.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {showAddActivity === stop.id && (
                      <div className="p-4 border-2 border-dashed border-orange-200 rounded-3xl space-y-4">
                        <input 
                          autoFocus
                          placeholder="What activity?" 
                          className="w-full bg-transparent border-none focus:ring-0 font-bold text-lg"
                          value={actTitle}
                          onChange={e => setActTitle(e.target.value)}
                        />
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                             <DollarSign size={14} className="text-gray-400" />
                             <input 
                              type="number"
                              placeholder="Cost" 
                              className="w-20 outline-none text-sm font-bold"
                              value={actCost}
                              onChange={e => setActCost(e.target.value)}
                             />
                          </div>
                          <Button className="py-2 text-xs" onClick={() => handleAddActivity(stop.id)}>Save</Button>
                          <Button variant="ghost" className="py-2 text-xs" onClick={() => setShowAddActivity(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex justify-end">
                       <button onClick={() => itineraryService.deleteStop(trip.id, stop.id)} className="text-red-500 text-sm font-bold flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                         <Trash2 size={14} /> Remove Stop
                       </button>
                    </div>
                  </motion.div>
                )}
              </Card>
            </div>
          ))}

          {showAddStop ? (
            <Card className="border-2 border-orange-500 bg-orange-50/30">
               <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h4 className="text-xl font-bold">New Stop</h4>
                   <Button variant="ghost" icon={X} onClick={() => setShowAddStop(false)}>Close</Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-400">City Name</label>
                    <input 
                       autoFocus
                       className="w-full bg-white px-6 py-4 rounded-2xl text-xl font-bold focus:shadow-lg transition-all outline-none"
                       placeholder="Where to?"
                       value={newStopCity}
                       onChange={e => setNewStopCity(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-400">Arrival</label>
                      <input type="date" className="w-full bg-white px-4 py-3 rounded-2xl font-bold outline-none" value={newStopArrival} onChange={e => setNewStopArrival(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-gray-400">Departure</label>
                      <input type="date" className="w-full bg-white px-4 py-3 rounded-2xl font-bold outline-none" value={newStopDeparture} onChange={e => setNewStopDeparture(e.target.value)} />
                    </div>
                  </div>
                </div>
                <Button className="w-full py-4 text-lg" onClick={handleAddStop}>Confirm Stop</Button>
               </div>
            </Card>
          ) : (
             <button 
              onClick={() => setShowAddStop(true)}
              className="w-full border-2 border-dashed border-gray-200 rounded-3xl py-12 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all hover:bg-orange-50/30"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                <Plus size={24} />
              </div>
              <p className="font-bold text-lg uppercase tracking-wider">Add A Stop</p>
            </button>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-[#141414] text-white border-none p-8">
              <h4 className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-4">Journey Stats</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-sm">Total Stops</p>
                  <p className="text-3xl font-bold">{stops.length}</p>
                </div>
                 <div>
                  <p className="text-gray-400 text-sm">Days on the Road</p>
                  <p className="text-3xl font-bold">
                    {stops.length > 0 ? (
                       Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))
                    ) : 0}
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">Average Daily Cost</p>
                  <p className="text-2xl font-bold text-orange-500">
                    ${stops.length > 0 ? (totalBudget / Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2) : 0}
                  </p>
                </div>
              </div>
           </Card>

           <Card className="p-8">
              <h4 className="font-bold text-lg mb-4">Journey Path</h4>
              <div className="space-y-4">
                {stops.map((stop, i) => (
                  <div key={stop.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{stop.cityName}</p>
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
