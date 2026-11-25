import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

let database;

export function getFirebaseDatabase() {
  if (database) return database;

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error("Firebase isn’t configured. Add the Firebase web app settings to frontend/.env.");
  }

  const app = getApps().length ? getApp() : initializeApp(config);
  database = getFirestore(app);
  return database;
}
