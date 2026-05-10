import { Plus, MapPin, Calendar, Trash2, Edit } from 'lucide-react';
import { SectionHeader, Card, Button } from './Theme';
import { Trip } from '../types';
import { tripService } from '../services/tripService';

interface MyTripsProps {
  trips: Trip[];
  onPlanNew: () => void;
  onViewTrip: (trip: Trip) => void;
  onEditTrip: (trip: Trip) => void;
}

export function MyTrips({ trips, onPlanNew, onViewTrip, onEditTrip }: MyTripsProps) {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trip?')) {
      await tripService.deleteTrip(id);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="My Journeys" 
        subtitle={`${trips.length} adventures planned so far`}
        action={
          <Button onClick={onPlanNew} icon={Plus}>+ New Adventure</Button>
        }
      />

      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map(trip => (
            <Card 
              key={trip.id} 
              onClick={() => onViewTrip(trip)}
              className="group flex flex-col h-full !p-0 border-slate-200"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img 
                  src={trip.coverPhoto || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600`} 
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEditTrip(trip); }}
                    className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-slate-700 hover:bg-white transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, trip.id)}
                    className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-red-500 hover:bg-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-slate-800">{trip.name}</h4>
                  <div className="text-[10px] bg-slate-50 text-slate-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                    {new Date(trip.startDate).getFullYear()}
                  </div>
                </div>
                <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed mb-6">
                  {trip.description || 'Exploring new horizons and creating memories.'}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={14} className="text-slate-300" />
                    {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-primary">
                    View Details
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed bg-transparent shadow-none border-slate-200">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">Ready for your next trip?</h3>
          <p className="text-slate-500 max-w-xs mb-8 text-sm font-medium">
            Create your first itinerary and start mapping out your worldwide destinations today.
          </p>
          <Button onClick={onPlanNew} icon={Plus}>Create My First Trip</Button>
        </Card>
      )}
    </div>
  );
}
