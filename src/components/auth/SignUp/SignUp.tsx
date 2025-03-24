'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import type { OnSignUp } from './SignUpForm'

type SignUpProps = {
    signInUrl?: string
    onSignUp?: OnSignUp
    disabled?: boolean
}

export const SignUp = ({ onSignUp, signInUrl = '/sign-in', disabled = false }: SignUpProps) => {
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
            <div className="mb-8">
                <h3 className="mb-1">Registrieren</h3>
                <p className="font-semibold heading-text">
                    Starte jetzt mit deiner kostenlosen Testphase
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignUpForm onSignUp={onSignUp} setMessage={setMessage} disabled={disabled} />
            <div>
                <div className="mt-6 text-center">
                    <span>Du hast bereits ein Konto? </span>
                    <ActionLink
                        href={signInUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Anmelden
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignUp
