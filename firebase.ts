import {getApp, getApps, initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCG0mSkqgUQY8066vem85omC2iH6XVAF30",
    authDomain: "dropbox-clone-za.firebaseapp.com",
    projectId: "dropbox-clone-za",
    storageBucket: "dropbox-clone-za.appspot.com",
    messagingSenderId: "502269269453",
    appId: "1:502269269453:web:c2237a923e1181cffaa084"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage};