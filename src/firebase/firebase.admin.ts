import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Für die Produktion würden wir die Service-Account-Daten aus Umgebungsvariablen laden
// Für die Entwicklung reicht die Projektkonfiguration, da Firebase automatisch Anmeldedaten findet
const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    // Wenn keine Service-Account-Daten verfügbar sind, benutzt Firebase die
    // Standard-Anmeldedaten aus der Umgebung oder Google Cloud
    initializeApp({
      projectId: "carrinex-app",
    });
  }
  
  return {
    db: getFirestore(),
    auth: getAuth(),
  };
};

export const { db, auth } = initializeFirebaseAdmin(); 