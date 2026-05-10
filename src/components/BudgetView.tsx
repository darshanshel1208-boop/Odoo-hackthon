import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { SectionHeader, Card } from './Theme';
import { Trip, TripActivity } from '../types';
import { itineraryService } from '../services/itineraryService';
import { DollarSign, PieChart as PieIcon, BarChart3, AlertCircle } from 'lucide-react';

interface BudgetViewProps {
  trips: Trip[];
}

export function BudgetView({ trips }: BudgetViewProps) {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [activities, setActivities] = useState<TripActivity[]>([]);

  useEffect(() => {
    if (selectedTripId) {
      const unsub = itineraryService.subscribeToActivities(selectedTripId, setActivities);
      return unsub;
    }
  }, [selectedTripId]);

  const selectedTrip = trips.find(t => t.id === selectedTripId);
  const totalCost = activities.reduce((sum, a) => sum + a.cost, 0);
  const highCostActivities = activities.filter(a => a.cost > 500);

  const categoryData = [
    { name: 'Transport', value: activities.filter(a => a.category === 'Transport').reduce((s, a) => s + a.cost, 0) },
    { name: 'Stay', value: activities.filter(a => a.category === 'Stay').reduce((s, a) => s + a.cost, 0) },
    { name: 'Activities', value: activities.filter(a => a.category === 'Activities' || !a.category).reduce((s, a) => s + a.cost, 0) },
    { name: 'Meals', value: activities.filter(a => a.category === 'Meals').reduce((s, a) => s + a.cost, 0) },
  ].filter(d => d.value > 0);

  const COLORS = ['#F97316', '#141414', '#94A3B8', '#FDBA74'];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Budget Insights" 
        subtitle="Track and manage your travel finances."
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

      {highCostActivities.length > 0 && (
        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600">
          <AlertCircle size={32} />
          <div>
            <p className="font-extrabold text-lg">High Spending Alerts</p>
            <p className="font-medium">You have {highCostActivities.length} activities exceeding $500. Consider reviewing these for potential savings.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-orange-500 text-white border-none flex flex-col justify-between">
          <div>
            <DollarSign size={40} className="mb-4 opacity-50" />
            <h3 className="text-xl font-bold opacity-80 uppercase tracking-widest text-sm mb-1">Total Estimated Cost</h3>
            <p className="text-5xl font-bold">${totalCost.toLocaleString()}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-orange-400">
             <p className="text-orange-100 text-sm font-medium">Daily Average</p>
             <p className="text-2xl font-bold">
               ${selectedTrip ? (totalCost / Math.ceil((new Date(selectedTrip.endDate).getTime() - new Date(selectedTrip.startDate).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2) : 0}
             </p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
           <div className="flex items-center gap-2 mb-8">
             <PieIcon size={20} className="text-orange-500" />
             <h4 className="font-bold text-lg">Category Breakdown</h4>
           </div>
           <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                No cost data available for this trip yet.
              </div>
            )}
           </div>
        </Card>

        <Card className="lg:col-span-3">
           <div className="flex items-center gap-2 mb-8">
             <BarChart3 size={20} className="text-orange-500" />
             <h4 className="font-bold text-lg">Cost Concentration</h4>
           </div>
           <div className="h-64">
              {activities.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activities.slice(0, 5)}>
                    <XAxis dataKey="title" hide={true} />
                    <YAxis />
                    <Tooltip cursor={{fill: '#FFF7ED'}} />
                    <Bar dataKey="cost" fill="#F97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                 <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                  Add activities with costs to see comparison.
                </div>
              )}
           </div>
        </Card>
      </div>
    </div>
  );
}
