'use server'
import type { SignInCredential } from '@/@types/auth'
import { signInUserData } from '@/mock/data/authData'
import sleep from '@/utils/sleep'
import { loginWithEmailAndPassword } from '@/firebase/auth'
import { getUserById } from '@/firebase/firestore'

// Diese Funktion validiert Benutzeranmeldedaten gegen Firebase
const validateCredential = async (values: SignInCredential) => {
    const { email, password } = values
    
    try {
        // Versuche, den Benutzer mit Firebase Auth anzumelden
        const userCredential = await loginWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;
        
        // Hole zusätzliche Benutzerdaten aus Firestore
        const userData = await getUserById(firebaseUser.uid);
        
        if (!userData) {
            console.error('User not found in Firestore');
            return null;
        }
        
        // Erstelle ein Benutzerobjekt, das mit dem Template kompatibel ist
        return {
            id: firebaseUser.uid,
            userName: userData.displayName || firebaseUser.displayName || '',
            email: userData.email,
            avatar: firebaseUser.photoURL || '',
            // Weitere benötigte Felder können hier ergänzt werden
        };
    } catch (error) {
        console.error('Error validating credentials:', error);
        return null;
    }
    
    // Als Fallback für die Entwicklung, die Mock-Daten verwenden
    // In Produktion sollte dieser Teil entfernt werden
    /*
    await sleep(80)
    const user = signInUserData.find(
        (user) => user.email === email && user.password === password,
    )
    return user
    */
}

export default validateCredential
