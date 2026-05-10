import { collection, addDoc, updateDoc, deleteDoc, query, where, onSnapshot, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChecklistItem, OperationType } from '../types';
import { handleFirestoreError } from '../lib/utils';

export const checklistService = {
  async addItem(itemData: Partial<ChecklistItem>): Promise<string> {
    const path = `trips/${itemData.tripId}/checklist`;
    try {
      const docRef = await addDoc(collection(db, path), {
        ...itemData,
        completed: false
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  async updateItem(tripId: string, itemId: string, completed: boolean): Promise<void> {
    const path = `trips/${tripId}/checklist/${itemId}`;
    try {
      await updateDoc(doc(db, 'trips', tripId, 'checklist', itemId), { completed });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteItem(tripId: string, itemId: string): Promise<void> {
    const path = `trips/${tripId}/checklist/${itemId}`;
    try {
      await deleteDoc(doc(db, 'trips', tripId, 'checklist', itemId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToChecklist(tripId: string, callback: (items: ChecklistItem[]) => void) {
    const q = query(collection(db, 'trips', tripId, 'checklist'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChecklistItem));
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `trips/${tripId}/checklist`);
    });
  }
};
