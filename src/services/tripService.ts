import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Trip, OperationType } from '../types';
import { handleFirestoreError } from '../lib/utils';

const TRIPS_COLLECTION = 'trips';

export const tripService = {
  async createTrip(tripData: Partial<Trip>): Promise<string> {
    if (!auth.currentUser) throw new Error("Authentication required");
    const path = TRIPS_COLLECTION;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...tripData,
        ownerId: auth.currentUser.uid,
        collaborators: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async updateTrip(tripId: string, tripData: Partial<Trip>): Promise<void> {
    const path = `${TRIPS_COLLECTION}/${tripId}`;
    try {
      const docRef = doc(db, TRIPS_COLLECTION, tripId);
      await updateDoc(docRef, {
        ...tripData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteTrip(tripId: string): Promise<void> {
    const path = `${TRIPS_COLLECTION}/${tripId}`;
    try {
      await deleteDoc(doc(db, TRIPS_COLLECTION, tripId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToUserTrips(uid: string, callback: (trips: Trip[]) => void) {
    const q = query(collection(db, TRIPS_COLLECTION), where("ownerId", "==", uid));
    return onSnapshot(q, (snapshot) => {
      const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
      callback(trips);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, TRIPS_COLLECTION);
    });
  }
};
