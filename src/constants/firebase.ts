import { initializeApp } from 'firebase/app';
import { getFirestore, collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { PointCollectionInterface } from 'model/pointCollection';
import { ReportInterface } from 'model/report';
import { RouteCollectionInterface } from 'model/routeCollection';
import { UserInterface } from 'model/user';

const firebaseConfig = {
  apiKey: 'AIzaSyC9aGrvr6mV60pY2b8XYai0lZvYwpKSiIs',
  authDomain: 'positioning-bdf84.firebaseapp.com',
  projectId: 'positioning-bdf84',
  storageBucket: 'positioning-bdf84.appspot.com',
  messagingSenderId: '792871183480',
  appId: '1:792871183480:web:b94d0633f8d3a46fcb798d',
  measurementId: 'G-G1TF3F1EWS',
};

export const firebase = initializeApp(firebaseConfig);

const firestore = getFirestore();

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const usersCol = createCollection<UserInterface>(`users`);
export const reportsCol = createCollection<ReportInterface>(`reports`);
export const pointCollectionCol = createCollection<PointCollectionInterface>(`points`);
export const routeCollectionCol = createCollection<RouteCollectionInterface>(`routes`);
