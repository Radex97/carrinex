'use client'

import { Radio } from '@/components/ui/Radio'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Card from '@/components/ui/Card'
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
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6 text-center">
                <h4 className="text-xl font-semibold mb-2">Wähle deinen Unternehmenstyp</h4>
                <p className="text-gray-500">
                    Dies bestimmt, welche Funktionen für dich verfügbar sind und wie dein Unternehmen in unserem System gehandhabt wird.
                </p>
            </div>
            
            <FormContainer>
                <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                                companyData.type === 'versender' ? 'border-primary ring-1 ring-primary' : ''
                            }`}
                            onClick={() => handleTypeChange('versender')}
                        >
                            <Radio value="versender" 
                                checked={companyData.type === 'versender'}
                                onChange={e => handleTypeChange(e.target.value)}
                            >
                                <h5 className="font-medium text-lg">Versender</h5>
                            </Radio>
                            <p className="text-gray-500 ml-7 mt-2">
                                Ich möchte Fracht versenden und Transportaufträge ausschreiben.
                            </p>
                        </Card>
                        
                        <Card
                            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                                companyData.type === 'subunternehmer' ? 'border-primary ring-1 ring-primary' : ''
                            }`}
                            onClick={() => handleTypeChange('subunternehmer')}
                        >
                            <Radio value="subunternehmer" 
                                checked={companyData.type === 'subunternehmer'}
                                onChange={e => handleTypeChange(e.target.value)}
                            >
                                <h5 className="font-medium text-lg">Subunternehmer</h5>
                            </Radio>
                            <p className="text-gray-500 ml-7 mt-2">
                                Ich bin ein Transportunternehmen und möchte Aufträge annehmen.
                            </p>
                        </Card>
                    </div>
                </FormItem>
                
                <div className="flex justify-end mt-8">
                    <Button 
                        variant="solid" 
                        onClick={handleNext}
                        disabled={!companyData.type}
                        size="lg"
                    >
                        Weiter
                    </Button>
                </div>
            </FormContainer>
        </div>
    )
} 