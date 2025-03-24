'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import type { CompanyType } from '@/firebase/firestore'

// Fahrzeugtypen für Subunternehmer
const vehicleOptions = [
    { value: 'kleinwagen', label: 'Kleinwagen' },
    { value: 'transporter', label: 'Transporter' },
    { value: 'lkw_75', label: 'LKW bis 7,5t' },
    { value: 'lkw_12', label: 'LKW bis 12t' },
    { value: 'lkw_40', label: 'LKW bis 40t' },
    { value: 'sattelzug', label: 'Sattelzug' },
]

// Industrieoptionen für Versender
const industryOptions = [
    { value: 'einzelhandel', label: 'Einzelhandel' },
    { value: 'grosshandel', label: 'Großhandel' },
    { value: 'lebensmittel', label: 'Lebensmittel' },
    { value: 'bau', label: 'Bauwesen' },
    { value: 'pharma', label: 'Pharmazeutik' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'automotive', label: 'Automobilindustrie' },
    { value: 'andere', label: 'Andere' },
]

// Frachtoptionen für Versender
const cargoOptions = [
    { value: 'pakete', label: 'Pakete' },
    { value: 'paletten', label: 'Paletten' },
    { value: 'container', label: 'Container' },
    { value: 'kuehlfracht', label: 'Kühlfracht' },
    { value: 'gefahrgut', label: 'Gefahrgut' },
    { value: 'schwerlast', label: 'Schwerlast' },
]

// Deutsche Bundesländer als Servicegebiete
const stateOptions = [
    { value: 'baden-wuerttemberg', label: 'Baden-Württemberg' },
    { value: 'bayern', label: 'Bayern' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'brandenburg', label: 'Brandenburg' },
    { value: 'bremen', label: 'Bremen' },
    { value: 'hamburg', label: 'Hamburg' },
    { value: 'hessen', label: 'Hessen' },
    { value: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern' },
    { value: 'niedersachsen', label: 'Niedersachsen' },
    { value: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen' },
    { value: 'rheinland-pfalz', label: 'Rheinland-Pfalz' },
    { value: 'saarland', label: 'Saarland' },
    { value: 'sachsen', label: 'Sachsen' },
    { value: 'sachsen-anhalt', label: 'Sachsen-Anhalt' },
    { value: 'schleswig-holstein', label: 'Schleswig-Holstein' },
    { value: 'thueringen', label: 'Thüringen' },
]

interface CompanyData {
    type: CompanyType
    vatId: string
    phoneNumber: string
    contactEmail: string
    vehicleTypes: string[]
    serviceAreas: string[]
    industry: string
    preferredCargoTypes: string[]
}

interface CompanyDetailsStepProps {
    companyData: CompanyData
    updateCompanyData: (data: Partial<CompanyData>) => void
    onNext: () => void
    onPrev: () => void
}

// Schema für Subunternehmen
const subunternehmerSchema = z.object({
    vatId: z.string().min(1, 'Bitte gib deine USt-IdNr. ein'),
    phoneNumber: z.string().min(1, 'Bitte gib eine Telefonnummer ein'),
    contactEmail: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
    vehicleTypes: z.array(z.string()).min(1, 'Bitte wähle mindestens einen Fahrzeugtyp'),
    serviceAreas: z.array(z.string()).min(1, 'Bitte wähle mindestens ein Servicegebiet')
});

// Schema für Versender
const versenderSchema = z.object({
    vatId: z.string().min(1, 'Bitte gib deine USt-IdNr. ein'),
    phoneNumber: z.string().min(1, 'Bitte gib eine Telefonnummer ein'),
    contactEmail: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
    industry: z.string().min(1, 'Bitte wähle eine Branche'),
    preferredCargoTypes: z.array(z.string()).min(1, 'Bitte wähle mindestens einen Frachttyp')
});

export const CompanyDetailsStep = ({
    companyData,
    updateCompanyData,
    onNext,
    onPrev
}: CompanyDetailsStepProps) => {
    
    // Bestimme das Schema basierend auf dem Unternehmenstyp
    const validationSchema = companyData.type === 'subunternehmer' 
        ? subunternehmerSchema 
        : versenderSchema;
    
    // Type für die Formular-Daten
    type FormData = z.infer<typeof validationSchema>;
    
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: companyData.type === 'subunternehmer' 
            ? {
                vatId: companyData.vatId,
                phoneNumber: companyData.phoneNumber,
                contactEmail: companyData.contactEmail,
                vehicleTypes: companyData.vehicleTypes,
                serviceAreas: companyData.serviceAreas
            } 
            : {
                vatId: companyData.vatId,
                phoneNumber: companyData.phoneNumber,
                contactEmail: companyData.contactEmail,
                industry: companyData.industry,
                preferredCargoTypes: companyData.preferredCargoTypes
            }
    });
    
    const onSubmit = (data: FormData) => {
        updateCompanyData(data);
        onNext();
    };

    // Handler für Checkbox-Gruppen
    const handleCheckboxChange = (
        name: 'vehicleTypes' | 'serviceAreas' | 'preferredCargoTypes', 
        value: string, 
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;
        const currentValues = companyData[name] || [];
                
        const newValues = checked
            ? [...currentValues, value]
            : currentValues.filter(v => v !== value);
            
        // Update both form state and parent state
        setValue(name as any, newValues as any);
        updateCompanyData({ [name]: newValues } as Partial<CompanyData>);
    };
    
    return (
        <div>
            <h4 className="mb-4">Unternehmensdetails</h4>
            <p className="mb-6 text-gray-500">
                {companyData.type === 'subunternehmer'
                    ? 'Bitte gib spezifische Details zu deinem Transportunternehmen an.'
                    : 'Bitte gib spezifische Details zu deinem Versenderunternehmen an.'}
            </p>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="USt-IdNr."
                        invalid={Boolean(errors.vatId)}
                        errorMessage={errors.vatId?.message}
                    >
                        <Controller
                            name="vatId"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="USt-IdNr."
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Telefonnummer"
                        invalid={Boolean(errors.phoneNumber)}
                        errorMessage={errors.phoneNumber?.message}
                    >
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Telefonnummer"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                
                <FormItem
                    label="Kontakt E-Mail"
                    invalid={Boolean(errors.contactEmail)}
                    errorMessage={errors.contactEmail?.message}
                >
                    <Controller
                        name="contactEmail"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="Kontakt E-Mail"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                
                {companyData.type === 'subunternehmer' ? (
                    <>
                        <FormItem
                            label="Fahrzeugtypen"
                            invalid={Boolean(errors.vehicleTypes)}
                            errorMessage={errors.vehicleTypes?.message}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {vehicleOptions.map(option => (
                                    <div key={option.value} className="flex items-center">
                                        <Checkbox 
                                            checked={companyData.vehicleTypes.includes(option.value)}
                                            onChange={(e) => handleCheckboxChange('vehicleTypes', option.value, e)}
                                        >
                                            {option.label}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                        
                        <FormItem
                            label="Servicegebiete"
                            invalid={Boolean(errors.serviceAreas)}
                            errorMessage={errors.serviceAreas?.message}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {stateOptions.map(option => (
                                    <div key={option.value} className="flex items-center">
                                        <Checkbox 
                                            checked={companyData.serviceAreas.includes(option.value)}
                                            onChange={(e) => handleCheckboxChange('serviceAreas', option.value, e)}
                                        >
                                            {option.label}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                    </>
                ) : (
                    <>
                        <FormItem
                            label="Branche"
                            invalid={Boolean(errors.industry)}
                            errorMessage={errors.industry?.message}
                        >
                            <Controller
                                name="industry"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={industryOptions}
                                        value={industryOptions.find(option => option.value === field.value)}
                                        onChange={option => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>
                        
                        <FormItem
                            label="Bevorzugte Frachttypen"
                            invalid={Boolean(errors.preferredCargoTypes)}
                            errorMessage={errors.preferredCargoTypes?.message}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {cargoOptions.map(option => (
                                    <div key={option.value} className="flex items-center">
                                        <Checkbox 
                                            checked={companyData.preferredCargoTypes.includes(option.value)}
                                            onChange={(e) => handleCheckboxChange('preferredCargoTypes', option.value, e)}
                                        >
                                            {option.label}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                    </>
                )}
                
                <div className="flex justify-between mt-8">
                    <Button
                        variant="twoTone"
                        onClick={onPrev}
                        type="button"
                    >
                        Zurück
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                    >
                        Weiter
                    </Button>
                </div>
            </Form>
        </div>
    )
} 