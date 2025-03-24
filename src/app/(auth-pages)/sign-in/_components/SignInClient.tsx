'use client'

import { signIn } from 'next-auth/react'
import toast from '@/components/ui/toast'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import SignIn from '@/components/auth/SignIn'
import Link from 'next/link'
import cn from 'classnames'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { OnSignInPayload } from '@/components/auth/SignIn'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/firebase.config'
import { getUserById, getCompanyById } from '@/firebase/firestore'

const SignInClient = () => {
    const [isRedirecting, setIsRedirecting] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

    const onSignInWithCredentials = async (payload: OnSignInPayload) => {
        const { values, setSubmitting, setMessage } = payload
        try {
            setSubmitting(true)
            setIsRedirecting(true)
            
            // Mit Firebase anmelden
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                values.email, 
                values.password
            );
            
            // Mit NextAuth anmelden
            const result = await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (result?.error) {
                setIsRedirecting(false)
                setSubmitting(false)
                setMessage('Ungültige Anmeldedaten')
                return
            }
            
            toast.push(
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-success">
                        Erfolgreich angemeldet
                    </span>
                </div>,
                {
                    placement: 'top-center',
                }
            )
            
            // Benutzerdaten für die Weiterleitung prüfen
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userData = await getUserById(currentUser.uid);
                
                if (userData) {
                    // Admin-Benutzer zum Admin-Dashboard weiterleiten
                    if (userData.role === 'admin') {
                        router.push('/admin/dashboard');
                        return;
                    }
                    
                    // Nicht onboarded? Zum Onboarding weiterleiten
                    if (!userData.isOnboarded || !userData.companyId) {
                        router.push('/onboarding');
                        return;
                    }
                    
                    // Onboarded? Zum entsprechenden Dashboard je nach Unternehmenstyp
                    if (userData.companyId) {
                        const company = await getCompanyById(userData.companyId);
                        if (company) {
                            if (company.type === 'versender') {
                                router.push('/versender/dashboard');
                                return;
                            } else if (company.type === 'subunternehmer') {
                                router.push('/subunternehmer/dashboard');
                                return;
                            }
                        }
                    }
                }
            }
            
            // Fallback: Zum allgemeinen Dashboard oder zur Callback-URL
            router.push(callbackUrl);
            
        } catch (error: any) {
            console.error('Anmeldefehler:', error)
            setIsRedirecting(false)
            setSubmitting(false)
            
            // Fehlerbehandlung für Firebase-Fehler
            if (error.code === 'auth/invalid-credential' || 
                error.code === 'auth/user-not-found' || 
                error.code === 'auth/wrong-password') {
                setMessage('Ungültige Anmeldedaten')
            } else if (error.code === 'auth/too-many-requests') {
                setMessage('Zu viele Anmeldeversuche. Bitte versuche es später erneut.')
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
                        ANMELDEN
                    </h4>
                    <div className="mt-6">
                        <SignIn
                            onSignIn={onSignInWithCredentials}
                            isRedirecting={isRedirecting}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center py-4">
                        <p className="text-center text-sm text-gray-700">
                            Noch kein Konto?{' '}
                            <Link
                                className="text-primary hover:underline"
                                href="/sign-up"
                            >
                                Registrieren
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

export default SignInClient
