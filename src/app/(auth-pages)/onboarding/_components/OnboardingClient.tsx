'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Logo from '@/components/template/Logo'
import Steps from '@/components/ui/Steps'
import Button from '@/components/ui/Button'
import useTheme from '@/utils/hooks/useTheme'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { createCompany } from '@/firebase/firestore'
import { auth } from '@/firebase/firebase.config'
import { CompanyType } from '@/firebase/firestore'
import { CompanyTypeStep } from './CompanyTypeStep' // Angepasst/Erstellt
import { CompanyInfoStep } from './CompanyInfoStep' // Erstellt

// Typendefinitionen erweitern
interface Address {
    street: string;
    city: string;
    zip: string;
    country: string;
}

interface CompanyData {
    name: string;
    type: CompanyType;
    address: Address;
    isMainLocation: boolean;
    vatId: string; // oder ein anderer Name für die Steuernummer
    phoneNumber: string;
}

const initialCompanyData: CompanyData = {
    name: '',
    type: '' as CompanyType,
    address: { street: '', city: '', zip: '', country: 'Deutschland' }, // Standardwerte
    isMainLocation: true, // Standardmäßig Hauptstandort
    vatId: '',
    phoneNumber: '',
};

const OnboardingClient = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [companyData, setCompanyData] = useState<CompanyData>(initialCompanyData)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { data: session, status } = useSession()
    const mode = useTheme((state) => state.mode)

    useEffect(() => { if (status === 'unauthenticated') { router.push('/sign-in') } }, [status, router]);

    const updateCompanyData = (data: Partial<CompanyData>) => {
        setCompanyData(prev => ({ ...prev, ...data }))
    }

    const nextStep = () => {
        setCurrentStep(1); // Direkter Übergang zum zweiten Schritt
    }

    // Kein prevStep erforderlich, da nur zwei Schritte und "Zurück" im zweiten Schritt integriert ist

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const currentUser = auth.currentUser;
            if (!currentUser) { throw new Error('Kein angemeldeter Benutzer gefunden') }
            const companyCreateData = {
                adminId: currentUser.uid,
                ...companyData,
                // Ggf. weitere Anpassungen vor dem Erstellen des Unternehmens
            };

            // Unternehmen in Firestore erstellen
            await createCompany(companyCreateData, currentUser.uid)

            toast.push(
                <Notification title="Onboarding abgeschlossen!" type="success" duration={2000}>
                    Dein Unternehmen wurde erfolgreich eingerichtet.
                </Notification>
            )
            router.push('/dashboard')
        } catch (error: any) {
            toast.push(
                <Notification title="Fehler" type="danger">
                    {error.message || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'}
                </Notification>
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <CompanyTypeStep
                        selectedType={companyData.type}
                        onTypeChange={(type) => updateCompanyData({ type })}
                        onNext={nextStep}
                    />
                );
            case 1:
                return (
                    <CompanyInfoStep
                        companyData={companyData}
                        updateCompanyData={updateCompanyData}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        // Ggf. onBack-Funktion zum Zurücksetzen des Typs und zurück zu Schritt 0
                    />
                );
            default:
                return null
        }
    }

    if (status === 'loading') {
        return <div className="flex items-center justify-center h-screen">Lädt...</div>
    }

    return (
        <div className="w-full">
            <div className="mb-8 flex justify-center">
                <Logo
                    type="streamline"
                    mode={mode}
                    logoWidth={60}
                    logoHeight={60}
                />
            </div>
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-bold">Willkommen bei Carrinex!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Lass uns Dein Unternehmen einrichten.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
                <Steps current={currentStep}>
                    <Steps.Item title="Unternehmenstyp" />
                    <Steps.Item title="Unternehmensdaten" />                    
                </Steps>

                <div className="mt-8">
                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    )
}

export default OnboardingClient 