'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Logo from '@/components/template/Logo'
import Steps from '@/components/ui/Steps'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import useTheme from '@/utils/hooks/useTheme'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { CompanyTypeStep } from './steps/CompanyTypeStep'
import { CompanyInfoStep } from './steps/CompanyInfoStep'
import { CompanyDetailsStep } from './steps/CompanyDetailsStep'
import { FinishStep } from './steps/FinishStep'
import { createCompany } from '@/firebase/firestore'
import { auth } from '@/firebase/firebase.config'
import { CompanyType, CompanyLocation } from '@/firebase/firestore'

// Initialer Zustand für das Onboarding-Formular
const initialCompanyData = {
    name: '',
    type: '' as CompanyType,
    // Array von Standorten für das Formular (wird später als Subkollektion gespeichert)
    locations: [{
        name: 'Hauptstandort',
        address: {
            street: '',
            city: '',
            zip: '',
            country: 'Deutschland',
        },
        isMain: true
    }],
    vatId: '',
    phoneNumber: '',
    contactEmail: '',
    // Subunternehmer-spezifische Felder
    vehicleTypes: [] as string[],
    serviceAreas: [] as string[],
    // Versender-spezifische Felder
    industry: '',
    preferredCargoTypes: [] as string[],
}

const OnboardingClient = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [companyData, setCompanyData] = useState(initialCompanyData)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { data: session, status } = useSession()
    const mode = useTheme((state) => state.mode)

    // Prüfen, ob ein Benutzer angemeldet ist
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in')
        }
    }, [status, router])

    // Aktualisieren der Unternehmensdaten
    const updateCompanyData = (data: Partial<typeof initialCompanyData>) => {
        setCompanyData(prev => ({ ...prev, ...data }))
    }

    // Weiter zum nächsten Schritt
    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 3))
    }

    // Zurück zum vorherigen Schritt
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0))
    }

    // Onboarding-Prozess abschließen
    const finishOnboarding = async () => {
        try {
            setIsSubmitting(true)
            
            // Aktuelle Benutzer-ID aus Firebase Auth holen
            const currentUser = auth.currentUser
            if (!currentUser) {
                throw new Error('Kein angemeldeter Benutzer gefunden')
            }

            // Daten für die Unternehmenserstellung vorbereiten
            // Wir extrahieren die Standorte und übergeben sie separat
            const companyCreateData = {
                name: companyData.name,
                type: companyData.type,
                adminId: currentUser.uid,
                isApproved: false,
                locations: companyData.locations, // Diese werden als Subkollektion gespeichert
                contactInfo: {
                    vatId: companyData.vatId,
                    phoneNumber: companyData.phoneNumber,
                    email: companyData.contactEmail,
                },
                // Typ-spezifische Felder
                ...(companyData.type === 'subunternehmer' 
                    ? {
                        vehicleTypes: companyData.vehicleTypes,
                        serviceAreas: companyData.serviceAreas,
                    } 
                    : {
                        industry: companyData.industry,
                        preferredCargoTypes: companyData.preferredCargoTypes,
                    }
                )
            }

            // Unternehmen in Firestore erstellen
            await createCompany(companyCreateData, currentUser.uid)

            toast.push(
                <Notification title="Onboarding abgeschlossen!" type="success" duration={2000}>
                    Dein Unternehmen wurde erfolgreich eingerichtet.
                </Notification>
            )

            // Nach erfolgreicher Erstellung zum Dashboard weiterleiten
            router.push('/dashboard')
        } catch (error: any) {
            toast.push(
                <Notification title="Fehler" type="danger">
                    {error.message || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'}
                </Notification>
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // Aktuelle Schritt-Komponente bestimmen
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return <CompanyTypeStep 
                    companyData={companyData} 
                    updateCompanyData={updateCompanyData} 
                    onNext={nextStep} 
                />
            case 1:
                return <CompanyInfoStep 
                    companyData={companyData} 
                    updateCompanyData={updateCompanyData} 
                    onNext={nextStep} 
                    onPrev={prevStep} 
                />
            case 2:
                return <CompanyDetailsStep 
                    companyData={companyData} 
                    updateCompanyData={updateCompanyData} 
                    onNext={nextStep} 
                    onPrev={prevStep} 
                />
            case 3:
                return <FinishStep 
                    companyData={companyData} 
                    onFinish={finishOnboarding} 
                    onPrev={prevStep} 
                    isSubmitting={isSubmitting} 
                />
            default:
                return null
        }
    }

    if (status === 'loading') {
        return <div className="flex items-center justify-center h-screen">Laden...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-center">
                <Logo
                    type="streamline"
                    mode={mode}
                    logoWidth={60}
                    logoHeight={60}
                />
            </div>
            <div className="mb-8 text-center">
                <h2 className="mb-2">Willkommen bei Carrinex!</h2>
                <p className="font-semibold heading-text">
                    Lass uns Dein Unternehmen einrichten.
                </p>
            </div>
            
            <Card className="max-w-3xl mx-auto shadow-lg rounded-xl">
                <div className="p-4 sm:p-6 md:p-8">
                    <Steps current={currentStep}>
                        <Steps.Item title="Unternehmenstyp" />
                        <Steps.Item title="Unternehmensdaten" />
                        <Steps.Item title="Details" />
                        <Steps.Item title="Abschluss" />
                    </Steps>
                    
                    <div className="mt-8 max-w-2xl mx-auto">
                        {renderCurrentStep()}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default OnboardingClient 