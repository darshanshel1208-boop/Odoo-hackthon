/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PageContainer } from './components/Theme';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { MyTrips } from './components/MyTrips';
import { TripEditor } from './components/TripEditor';
import { ItineraryBuilder } from './components/ItineraryBuilder';
import { BudgetView } from './components/BudgetView';
import { PackingChecklist } from './components/PackingChecklist';
import GlobalExplorer from './components/GlobalExplorer';
import { ProfileSettings } from './components/ProfileSettings';
import { TripNotes } from './components/TripNotes';
import { Trip } from './types';
import { tripService } from './services/tripService';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (user) {
      const unsub = tripService.subscribeToUserTrips(user.uid, setTrips);
      return unsub;
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    if (viewingTrip) {
      return (
        <ItineraryBuilder 
          trip={viewingTrip} 
          onBack={() => setViewingTrip(null)} 
        />
      );
    }

    if (isCreating || editingTrip) {
      return (
        <TripEditor 
          trip={editingTrip} 
          onClose={() => { setIsCreating(false); setEditingTrip(null); }} 
          onSaved={() => { setIsCreating(false); setEditingTrip(null); }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            trips={trips} 
            onPlanNew={() => setIsCreating(true)} 
            onViewTrip={setViewingTrip} 
          />
        );
      case 'trips':
        return (
          <MyTrips 
            trips={trips} 
            onPlanNew={() => setIsCreating(true)} 
            onViewTrip={setViewingTrip} 
            onEditTrip={setEditingTrip}
          />
        );
      case 'budget':
        return <BudgetView trips={trips} />;
      case 'packing':
        return <PackingChecklist trips={trips} />;
      case 'explorer':
        return <GlobalExplorer />;
      case 'settings':
        return <ProfileSettings />;
      case 'notes':
        return <TripNotes trips={trips} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </PageContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
