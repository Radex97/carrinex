import type { NextAuthConfig } from 'next-auth'
import validateCredential from '../server/actions/user/validateCredential'
import Credentials from 'next-auth/providers/credentials'
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { db } from '@/firebase/firebase.config';
import { getUserById } from '@/firebase/firestore';

import type { SignInCredential } from '@/@types/auth'

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                /** validate credentials from backend here */
                const user = await validateCredential(
                    credentials as SignInCredential,
                )
                if (!user) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.userName,
                    email: user.email,
                    image: user.avatar,
                    authority: user.authority || ['user'],
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            // Füge Benutzer-ID und Rollen aus dem Token zur Session hinzu
            if (session.user) {
                session.user.id = token.sub as string;
                
                // Setze Standardrolle, falls keine Rollen vorhanden sind
                session.user.authority = token.authority as string[] || ['user'];
                
                try {
                    // Versuche, aktuelle Daten aus Firestore zu laden
                    const userData = await getUserById(token.sub as string);
                    if (userData) {
                        // Wenn Firestore-Daten vorhanden sind, verwende die Rollen von dort
                        const userType = userData.companyType || 'user';
                        
                        // Bestimme die Benutzerrolle basierend auf dem Unternehmenstyp
                        let userRoles: string[] = ['user'];
                        
                        if (userData.role === 'admin') {
                            userRoles = ['admin'];
                        } else if (userType === 'versender') {
                            userRoles = ['versender'];
                        } else if (userType === 'subunternehmer') {
                            userRoles = ['subunternehmer'];
                        }
                        
                        session.user.authority = userRoles;
                    }
                } catch (error) {
                    console.error('Fehler beim Laden der Benutzerdaten:', error);
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            // Wenn ein Benutzer vorhanden ist (nach der Anmeldung), füge Benutzerrollen hinzu
            if (user) {
                token.authority = user.authority || ['user'];
            }
            return token;
        },
        async signIn({ user }) {
            // Für Firebase-Integration: Hier können wir zusätzliche Validierungen durchführen
            if (user) {
                return true;
            }
            return false;
        }
    },
} satisfies NextAuthConfig
