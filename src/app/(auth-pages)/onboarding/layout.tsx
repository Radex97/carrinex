import { PropsWithChildren } from 'react'

// Ein angepasstes Layout für das Onboarding, das den gesamten Bildschirm optimal nutzt
export default function OnboardingLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 py-8 flex items-center">
                <div className="w-full max-w-4xl mx-auto relative">
                    {children}
                </div>
            </div>
            
            {/* Hintergrundbild auf der rechten Seite (Desktop only) */}
            <div className="fixed right-0 top-0 h-full w-1/3 hidden lg:block overflow-hidden">
                <div className="h-full w-full bg-[url('/img/others/auth-side-bg.png')] bg-cover bg-center"></div>
            </div>
        </div>
    )
} 