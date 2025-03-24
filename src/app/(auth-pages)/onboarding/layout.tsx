import Simple from '@/components/layouts/AuthLayout/Simple'
import { PropsWithChildren } from 'react'

// Ein angepasstes Layout für das Onboarding, das den gesamten Bildschirm optimal nutzt
export default function OnboardingLayout({ children }: PropsWithChildren) {
    return <Simple>{children}</Simple>
} 