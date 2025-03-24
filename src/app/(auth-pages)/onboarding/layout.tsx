import { PropsWithChildren } from 'react'

// Ein vereinfachtes Layout für das Onboarding mit einem sauberen Hintergrund
export default function OnboardingLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {children}
            </div>
        </div>
    )
} 