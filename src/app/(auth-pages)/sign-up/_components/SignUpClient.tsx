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

const SignUpClient = () => {
    const [isRedirecting, setIsRedirecting] = useState(false)
    const router = useRouter()

    const onSignUp = async (payload: OnSignUpPayload) => {
        const { values, setSubmitting, setMessage } = payload
        try {
            setSubmitting(true)
            setIsRedirecting(true)
            
            // Hier wird die Registrierung durchgeführt
            // Wenn erfolgreich, weiterleiten zum Onboarding
            
            toast.push(
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-success">
                        Registrierung erfolgreich
                    </span>
                </div>,
                {
                    placement: 'top-center',
                }
            )
            
            // Verzögerung für die Weiterleitung hinzufügen
            setTimeout(() => {
                router.push('/onboarding')
            }, 1000)
            
        } catch (error) {
            console.error('Registrierungsfehler:', error)
            setIsRedirecting(false)
            setSubmitting(false)
            setMessage('Ein unerwarteter Fehler ist aufgetreten')
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
