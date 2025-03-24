'use server'

import { signIn } from '@/auth'
import appConfig from '@/configs/app.config'
import { AuthError } from 'next-auth'
import { auth } from '@/firebase/firebase.config'
import { getUserById } from '@/firebase/firestore'
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
        
        // Prüfen Sie, ob der Benutzer das Onboarding abgeschlossen hat
        if (userData && !userData.isOnboarded) {
            // Wenn nicht onboarded, leiten Sie zum Onboarding-Prozess weiter
            return { redirectTo: '/onboarding' };
        }

        // Normale Weiterleitung für onboarded Benutzer
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
