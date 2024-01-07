// Import the functions you need from the SDKs you need
import { firebaseConfig } from "../fireBaseConfig.js"
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from 'firebase/storage'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//az adatbázisunk eléréshez kell példányosítani az adatbázis referenciából
export const db = getFirestore(app);
//az authentikáscióhoz szükséges referencia:
export const auth = getAuth(app);
export const storage=getStorage(app)