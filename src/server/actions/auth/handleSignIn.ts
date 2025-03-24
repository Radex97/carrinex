'use server'

import { signIn } from '@/auth'
import appConfig from '@/configs/app.config'
import { AuthError } from 'next-auth'
import { auth } from '@/firebase/firebase.config'
import { getUserById, getCompanyById } from '@/firebase/firestore'
import type { SignInCredential } from '@/@types/auth'

export const onSignInWithCredentials = async (
    { email, password }: SignInCredential,
    callbackUrl?: string,
) => {
    try {
        // Führe den Sign-In-Prozess durch
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false // Wir leiten nicht automatisch weiter
        });

        if (result?.error) {
            // Bei Anmeldefehler zurückgeben
            return { error: 'Ungültige Anmeldedaten!' };
        }

        // Aktueller Firebase-Benutzer
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
            return { error: 'Benutzerauthentifizierung fehlgeschlagen!' };
        }

        // Holen Sie die Benutzerdaten aus Firestore
        const userData = await getUserById(currentUser.uid);
        
        if (!userData) {
            return { error: 'Benutzerdaten konnten nicht abgerufen werden!' };
        }
        
        // Benutzer-Weiterleitungslogik
        
        // 1. Wenn Admin, zum Admin-Dashboard
        if (userData.role === 'admin') {
            return { redirectTo: '/admin/dashboard' };
        }
        
        // 2. Wenn nicht onboarded, zum Onboarding
        if (!userData.isOnboarded || !userData.companyId) {
            return { redirectTo: '/onboarding' };
        }
        
        // 3. Wenn onboarded, prüfen welcher Unternehmenstyp und entsprechend weiterleiten
        const company = await getCompanyById(userData.companyId);
        
        if (!company) {
            return { error: 'Unternehmensdaten konnten nicht abgerufen werden!' };
        }
        
        if (company.type === 'versender') {
            return { redirectTo: '/versender/dashboard' };
        } else if (company.type === 'subunternehmer') {
            return { redirectTo: '/subunternehmer/dashboard' };
        }
        
        // Fallback, falls der Unternehmenstyp unbekannt ist
        return { redirectTo: callbackUrl || appConfig.authenticatedEntryPath };
        
    } catch (error) {
        if (error instanceof AuthError) {
            /** Customize error message based on AuthError */
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Ungültige Anmeldedaten!' }
                default:
                    return { error: 'Ein Fehler ist aufgetreten!' }
            }
        }
        throw error
    }
}
