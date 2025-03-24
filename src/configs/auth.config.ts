import type { NextAuthConfig } from 'next-auth'
import validateCredential from '../server/actions/user/validateCredential'
import Credentials from 'next-auth/providers/credentials'
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { db } from '@/firebase/firebase.config';

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
                }
            },
        }),
    ],
    callbacks: {
        async session(payload) {
            /** apply extra user attributes here, for example, we add 'authority' & 'id' in this section */
            return {
                ...payload.session,
                user: {
                    ...payload.session.user,
                    id: payload.token.sub,
                    authority: ['admin', 'user'],
                },
            }
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
