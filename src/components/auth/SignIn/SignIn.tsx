'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './SignInForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import type { OnSignIn } from './SignInForm'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
    isRedirecting?: boolean
}

const SignIn = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
    isRedirecting = false,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useTheme((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    logoWidth={60}
                    logoHeight={60}
                />
            </div>
            <div className="mb-10">
                <h2 className="mb-2">Willkommen zurück!</h2>
                <p className="font-semibold heading-text">
                    Bitte gib deine Anmeldedaten ein, um dich anzumelden!
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            href={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            Passwort vergessen
                        </ActionLink>
                    </div>
                }
                onSignIn={onSignIn}
                disabled={isRedirecting}
            />
            <div>
                <div className="mt-6 text-center">
                    <span>{`Du hast noch kein Konto?`} </span>
                    <ActionLink
                        href={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Registrieren
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignIn
