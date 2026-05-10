export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
}

export interface Trip {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  coverPhoto: string | null;
  collaborators: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Stop {
  id: string;
  tripId: string;
  cityId: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  order: number;
}

export interface TripActivity {
  id: string;
  stopId: string;
  tripId: string;
  title: string;
  description: string;
  cost: number;
  startTime: string;
  duration: string;
  category: string;
  order: number;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  text: string;
  completed: boolean;
  category: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
