'use client'

import Button from '@/components/ui/Button'
import type { CompanyType, CompanyLocation } from '@/firebase/firestore'

interface CompanyData {
    name: string
    type: CompanyType
    locations: CompanyLocation[]
    vatId: string
    phoneNumber: string
    contactEmail: string
    vehicleTypes: string[]
    serviceAreas: string[]
    industry: string
    preferredCargoTypes: string[]
}

interface FinishStepProps {
    companyData: CompanyData
    onFinish: () => void
    onPrev: () => void
    isSubmitting: boolean
}

export const FinishStep = ({
    companyData,
    onFinish,
    onPrev,
    isSubmitting
}: FinishStepProps) => {
    return (
        <div>
            <h4 className="mb-4">Überprüfe deine Angaben</h4>
            <p className="mb-6 text-gray-500">
                Bitte überprüfe deine Unternehmensinformationen, bevor du den Onboarding-Prozess abschließt.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                <h5 className="font-semibold mb-4">Unternehmensinformationen</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Unternehmensname</p>
                        <p className="font-medium">{companyData.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Unternehmenstyp</p>
                        <p className="font-medium">
                            {companyData.type === 'subunternehmer' ? 'Subunternehmer' : 'Versender'}
                        </p>
                    </div>
                </div>
                
                <h5 className="font-semibold mb-4">Standorte</h5>
                {companyData.locations.map((location, index) => (
                    <div key={index} className="mb-6 border-b pb-4 border-gray-200 dark:border-gray-700 last:border-0">
                        <div className="flex items-center mb-2">
                            <h6 className="font-medium">{location.name}</h6>
                            {location.isMain && (
                                <span className="ml-2 px-2 py-0.5 bg-primary-500/10 text-primary-600 text-xs rounded-full">
                                    Hauptstandort
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Straße</p>
                                <p className="font-medium">{location.address.street}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Stadt</p>
                                <p className="font-medium">{location.address.city}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Postleitzahl</p>
                                <p className="font-medium">{location.address.zip}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Land</p>
                                <p className="font-medium">{location.address.country}</p>
                            </div>
                        </div>
                    </div>
                ))}
                
                <h5 className="font-semibold mb-4">Kontaktinformationen</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">USt-IdNr.</p>
                        <p className="font-medium">{companyData.vatId}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Telefonnummer</p>
                        <p className="font-medium">{companyData.phoneNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">E-Mail</p>
                        <p className="font-medium">{companyData.contactEmail}</p>
                    </div>
                </div>
                
                {companyData.type === 'subunternehmer' ? (
                    <>
                        <h5 className="font-semibold mb-4">Servicedetails</h5>
                        <div className="mb-6">
                            <p className="text-sm text-gray-500">Fahrzeugtypen</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {companyData.vehicleTypes.map((type, index) => (
                                    <span 
                                        key={index} 
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Servicegebiete</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {companyData.serviceAreas.map((area, index) => (
                                    <span 
                                        key={index} 
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h5 className="font-semibold mb-4">Branchendetails</h5>
                        <div className="mb-6">
                            <p className="text-sm text-gray-500">Branche</p>
                            <p className="font-medium">{companyData.industry}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bevorzugte Frachtarten</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {companyData.preferredCargoTypes.map((type, index) => (
                                    <span 
                                        key={index} 
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            
            <div className="flex items-center justify-between">
                <Button
                    variant="plain"
                    onClick={onPrev}
                    disabled={isSubmitting}
                >
                    Zurück
                </Button>
                <Button 
                    variant="solid" 
                    onClick={onFinish} 
                    loading={isSubmitting}
                >
                    Unternehmen erstellen
                </Button>
            </div>
        </div>
    )
} 