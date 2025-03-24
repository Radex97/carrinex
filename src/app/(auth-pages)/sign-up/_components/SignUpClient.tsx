'use client'

import { useState } from 'react'
import type { OnSignUpPayload } from '@/components/auth/SignUp'
import toast from '@/components/ui/toast'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import SignUp from '@/components/auth/SignUp'
import Link from 'next/link'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebase/firebase.config'
import { setDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/firebase.config'
import { signIn } from 'next-auth/react'
import Notification from '@/components/ui/Notification'

const SignUpClient = () => {
    const [isRedirecting, setIsRedirecting] = useState(false)
    const router = useRouter()

    const onSignUp = async (payload: OnSignUpPayload) => {
        const { values, setSubmitting, setMessage } = payload
        try {
            setSubmitting(true)
            setIsRedirecting(true)
            
            // Firebase-Benutzer erstellen
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            
            // Benutzerprofil aktualisieren
            await updateProfile(userCredential.user, {
                displayName: values.displayName
            });
            
            // Benutzer in Firestore speichern
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                displayName: values.displayName,
                email: values.email,
                role: 'user',
                isOnboarded: false,
                createdAt: new Date().toISOString()
            });
            
            // Erfolgsmeldung anzeigen (automatisch schließend)
            toast.push(
                <Notification type="success" duration={2000}>
                    <span className="font-semibold">
                        Registrierung erfolgreich
                    </span>
                </Notification>,
                {
                    placement: 'top-center'
                }
            );
            
            // Auch bei NextAuth anmelden
            await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false
            });
            
            // Direkt zum Onboarding weiterleiten
            setTimeout(() => {
                router.push('/onboarding');
            }, 500); // Kurze Verzögerung für bessere UX
            
        } catch (error: any) {
            console.error('Registrierungsfehler:', error)
            setIsRedirecting(false)
            setSubmitting(false)
            
            // Fehlermeldung basierend auf Firebase-Fehlercode anzeigen
            if (error.code === 'auth/email-already-in-use') {
                setMessage('Diese E-Mail-Adresse wird bereits verwendet')
            } else if (error.code === 'auth/invalid-email') {
                setMessage('Ungültige E-Mail-Adresse')
            } else if (error.code === 'auth/weak-password') {
                setMessage('Das Passwort ist zu schwach')
            } else {
                setMessage('Ein unerwarteter Fehler ist aufgetreten')
            }
        }
    }

    return (
        <div className="relative flex flex-col flex-auto min-h-screen">
            <div className="flex absolute right-0 p-6">
                <Link href="/">
                    <div className="rounded-full h-[35px] w-[35px] p-2 flex justify-center items-center bg-black bg-opacity-10 hover:bg-opacity-20 transition-colors">
                        X
                    </div>
                </Link>
            </div>

            <div className="h-full flex flex-col gap-4 items-center justify-center">
                <div className="mx-auto">
                    <Image
                        width={150}
                        height={136}
                        src="/img/logo/logo.png"
                        className="mx-auto"
                        alt="Logo"
                    />
                </div>
                <Card
                    className={cn(
                        'border-none rounded-2xl shadow-xl shadow-gray-900/10 w-[480px] mx-auto'
                    )}
                >
                    <h4 className="text-center text-primary font-semibold">
                        REGISTRIEREN
                    </h4>
                    <div className="mt-6">
                        <SignUp
                            onSignUp={onSignUp}
                            disabled={isRedirecting}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center py-4">
                        <p className="text-center text-sm text-gray-700">
                            Bereits registriert?{' '}
                            <Link
                                className="text-primary hover:underline"
                                href="/sign-in"
                            >
                                Anmelden
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
            <div className="py-4 text-center text-sm text-gray-500">
                © 2024 Carrinex. Alle Rechte vorbehalten.
            </div>
        </div>
    )
}

export default SignUpClient
