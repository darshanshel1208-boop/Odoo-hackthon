import { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { SectionHeader, Card, Button } from './Theme';
import { Trip } from '../types';
import { tripService } from '../services/tripService';

interface TripEditorProps {
  trip?: Trip | null;
  onClose: () => void;
  onSaved: () => void;
}

export function TripEditor({ trip, onClose, onSaved }: TripEditorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trip) {
      setName(trip.name);
      setDescription(trip.description);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setCoverPhoto(trip.coverPhoto || '');
    }
  }, [trip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = {
      name,
      description,
      startDate,
      endDate,
      coverPhoto: coverPhoto || null,
    };

    try {
      if (trip) {
        await tripService.updateTrip(trip.id, data as Partial<Trip>);
      } else {
        await tripService.createTrip(data as Partial<Trip>);
      }
      onSaved();
    } catch (error) {
      console.error("Failed to save trip", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeader 
        title={trip ? "Edit Journey" : "Begin New Journey"} 
        subtitle="Tell us a bit about your next great adventure."
        action={
          <Button variant="ghost" onClick={onClose} icon={X}>Cancel</Button>
        }
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Trip Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. European Summer 2026"
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:outline-none transition-all text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Calendar size={14} /> Start Date
              </label>
              <input 
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Calendar size={14} /> End Date
              </label>
              <input 
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the vibe of this trip?"
              rows={3}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

           <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
               <ImageIcon size={14} /> Cover Photo URL (Optional)
            </label>
            <input 
              type="url"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-6 flex flex-col md:flex-row gap-4">
            <Button 
              className="flex-1 text-lg py-4"
              icon={Save}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (trip ? 'Update Trip' : 'Create Trip')}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="md:w-32 py-4"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
