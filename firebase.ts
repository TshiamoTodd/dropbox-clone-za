import {getApp, getApps, initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY?.toString(),
    authDomain: process.env.FIREBASE_AUTH_DOMAIN?.toString(),
    projectId: process.env.FIREBASE_PROJECT_ID?.toString(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET?.toString(),
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID?.toString(),
    appId: process.env.FIREBASE_APP_ID?.toString()
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage};
