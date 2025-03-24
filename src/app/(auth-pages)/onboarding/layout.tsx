import Simple from '@/components/layouts/AuthLayout/Simple'
import { PropsWithChildren } from 'react'

// Ein angepasstes Layout für das Onboarding, das den gesamten Bildschirm optimal nutzt
export default function OnboardingLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full bg-white dark:bg-gray-800">
            <div className="flex flex-auto items-center justify-center min-w-0 h-full">
                <div className="w-3/4 max-w-4xl">
                    {children}
                </div>
            </div>
        </div>
    )
} 