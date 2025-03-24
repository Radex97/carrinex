'use client'

import { Radio } from '@/components/ui/Radio'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import type { CompanyType } from '@/firebase/firestore'

interface CompanyTypeStepProps {
    companyData: {
        type: CompanyType
    }
    updateCompanyData: (data: Partial<{ type: CompanyType }>) => void
    onNext: () => void
}

export const CompanyTypeStep = ({ 
    companyData, 
    updateCompanyData, 
    onNext 
}: CompanyTypeStepProps) => {
    
    const handleTypeChange = (value: string) => {
        updateCompanyData({ type: value as CompanyType })
    }
    
    const handleNext = () => {
        if (companyData.type) {
            onNext()
        }
    }
    
    return (
        <div>
            <h4 className="mb-4">Wähle deinen Unternehmenstyp</h4>
            <p className="mb-6 text-gray-500">
                Dies bestimmt, welche Funktionen für dich verfügbar sind und wie dein Unternehmen in unserem System gehandhabt wird.
            </p>
            
            <FormContainer>
                <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Radio.Group 
                            value={companyData.type} 
                            onChange={handleTypeChange}
                        >
                            <div className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors">
                                <Radio value="versender" className="mb-2">
                                    <h5 className="font-medium">Versender</h5>
                                </Radio>
                                <p className="text-sm text-gray-500 ml-7">
                                    Ich möchte Fracht versenden und Transportaufträge ausschreiben.
                                </p>
                            </div>
                            
                            <div className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors">
                                <Radio value="subunternehmer" className="mb-2">
                                    <h5 className="font-medium">Subunternehmer</h5>
                                </Radio>
                                <p className="text-sm text-gray-500 ml-7">
                                    Ich bin ein Transportunternehmen und möchte Aufträge annehmen.
                                </p>
                            </div>
                        </Radio.Group>
                    </div>
                </FormItem>
                
                <div className="flex justify-end mt-6">
                    <Button 
                        variant="solid" 
                        onClick={handleNext}
                        disabled={!companyData.type}
                    >
                        Weiter
                    </Button>
                </div>
            </FormContainer>
        </div>
    )
} 