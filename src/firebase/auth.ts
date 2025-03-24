import { auth, db } from './firebase.config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

// Registrierung
export const registerWithEmailAndPassword = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
  try {
    // Nutzer in Firebase Auth erstellen
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Profil-Update (Anzeigename)
    await updateProfile(user, { displayName });
    
    // E-Mail-Verifizierung senden (in Produktionsumgebung)
    // await sendEmailVerification(user);
    
    // Nutzerdokument in Firestore erstellen
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      displayName,
      role: "companyAdmin", // Standardrolle für neue Nutzer
      isOnboarded: false,
      companyId: null, // Wird im Onboarding-Prozess gesetzt
      createdAt: Timestamp.now(),
    });
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Anmeldung
export const loginWithEmailAndPassword = (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Abmeldung
export const logoutUser = (): Promise<void> => {
  return signOut(auth);
};

// Passwort zurücksetzen
export const resetPassword = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
}; 