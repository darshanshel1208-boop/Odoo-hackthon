import { collection, addDoc, updateDoc, deleteDoc, query, where, onSnapshot, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Stop, TripActivity, OperationType } from '../types';
import { handleFirestoreError } from '../lib/utils';

export const itineraryService = {
  // Stops
  async addStop(stopData: Partial<Stop>): Promise<string> {
    const path = `trips/${stopData.tripId}/stops`;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...stopData,
        order: stopData.order || 0
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async updateStop(tripId: string, stopId: string, stopData: Partial<Stop>): Promise<void> {
    const path = `trips/${tripId}/stops/${stopId}`;
    try {
      await updateDoc(doc(db, 'trips', tripId, 'stops', stopId), stopData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteStop(tripId: string, stopId: string): Promise<void> {
    const path = `trips/${tripId}/stops/${stopId}`;
    try {
      await deleteDoc(doc(db, 'trips', tripId, 'stops', stopId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToStops(tripId: string, callback: (stops: Stop[]) => void) {
    const q = query(collection(db, 'trips', tripId, 'stops'), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
      const stops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stop));
      callback(stops);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `trips/${tripId}/stops`);
    });
  },

  // Activities
  async addActivity(activityData: Partial<TripActivity>): Promise<string> {
    const path = `trips/${activityData.tripId}/activities`;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...activityData,
        order: activityData.order || 0
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async updateActivity(tripId: string, activityId: string, activityData: Partial<TripActivity>): Promise<void> {
    const path = `trips/${tripId}/activities/${activityId}`;
    try {
      await updateDoc(doc(db, 'trips', tripId, 'activities', activityId), activityData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteActivity(tripId: string, activityId: string): Promise<void> {
    const path = `trips/${tripId}/activities/${activityId}`;
    try {
      await deleteDoc(doc(db, 'trips', tripId, 'activities', activityId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToActivities(tripId: string, callback: (activities: TripActivity[]) => void) {
    const q = query(collection(db, 'trips', tripId, 'activities'), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripActivity));
      callback(activities);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `trips/${tripId}/activities`);
    });
  }
};
