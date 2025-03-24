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
                
                // Verwende Rollen aus dem Token, um Firestore-Anfragen zu reduzieren
                session.user.authority = token.authority as string[] || ['user'];
                
                // Firestore-Anfragen nur für geschützte Routen durchführen,
                // nicht für öffentliche Seiten wie die Landing Page
                // Dies wird nun in den jeweiligen geschützten Komponenten durchgeführt
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
