import { ReactNode } from 'react'
import Simple from '@/components/layouts/AuthLayout/Simple'

// Ein angepasstes Layout für das Onboarding, das den gesamten Bildschirm optimal nutzt
export default function OnboardingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-800 w-full p-4">
            <div className="max-w-5xl mx-auto">
                {children}
            </div>
        </div>
    )
} 