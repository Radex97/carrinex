'use client'

import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import SignUp from '@/components/auth/SignUp'
import { useRouter } from 'next/navigation'
import type { OnSignUpPayload } from '@/components/auth/SignUp'
import { registerWithEmailAndPassword } from '@/firebase/auth'

const SignUpClient = () => {
    const router = useRouter()

    const handleSignUp = async ({
        values,
        setSubmitting,
        setMessage,
    }: OnSignUpPayload) => {
        try {
            setSubmitting(true)
            
            // Firebase-Registrierung
            await registerWithEmailAndPassword(
                values.email,
                values.password,
                values.displayName
            )
            
            toast.push(
                <Notification title="Konto erstellt!" type="success">
                    Dein Konto wurde erfolgreich erstellt. Du wirst nun zum Onboarding weitergeleitet.
                </Notification>,
            )
            
            // Weiterleitung zum Onboarding (wir werden diese Route später erstellen)
            router.push('/onboarding')
        } catch (error: any) {
            // Firebase-Fehlermeldungen verarbeiten
            let errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
            
            if (error?.code === 'auth/email-already-in-use') {
                errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet.'
            } else if (error?.code === 'auth/invalid-email') {
                errorMessage = 'Ungültige E-Mail-Adresse.'
            } else if (error?.code === 'auth/weak-password') {
                errorMessage = 'Das Passwort ist zu schwach. Bitte wähle ein sichereres Passwort.'
            } else if (error?.message) {
                errorMessage = error.message
            }
            
            setMessage(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    return <SignUp onSignUp={handleSignUp} />
}

export default SignUpClient
