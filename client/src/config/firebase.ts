import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '../config/config';

// Initialize Firebase
const Firebase = initializeApp(config.firebase);

// Setup Providers
export const Providers = {
    google: new GoogleAuthProvider()
};

// Initialize Firebase Auth and Firestore
export const auth = getAuth(Firebase);
export const firestore = getFirestore(Firebase);

export default Firebase;
