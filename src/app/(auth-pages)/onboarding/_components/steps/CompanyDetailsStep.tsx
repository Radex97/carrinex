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
import { useState } from 'react'

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

// Typ für die Subunternehmer-Formulardaten
type SubunternehmerFormData = z.infer<typeof subunternehmerSchema>;

// Typ für die Versender-Formulardaten
type VersenderFormData = z.infer<typeof versenderSchema>;

export const CompanyDetailsStep = ({
    companyData,
    updateCompanyData,
    onNext,
    onPrev
}: CompanyDetailsStepProps) => {
    // Lokale State für Checkbox-Werte
    const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>(companyData.vehicleTypes || []);
    const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>(companyData.serviceAreas || []);
    const [selectedCargoTypes, setSelectedCargoTypes] = useState<string[]>(companyData.preferredCargoTypes || []);
    
    // Wähle das richtige Schema und Form-Typ basierend auf dem Unternehmenstyp
    const isSubunternehmer = companyData.type === 'subunternehmer';
    
    // Type für die Formular-Daten als Union-Typ
    type FormData = SubunternehmerFormData | VersenderFormData;
    
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(isSubunternehmer ? subunternehmerSchema : versenderSchema),
        defaultValues: isSubunternehmer 
            ? {
                vatId: companyData.vatId,
                phoneNumber: companyData.phoneNumber,
                contactEmail: companyData.contactEmail,
                vehicleTypes: selectedVehicleTypes,
                serviceAreas: selectedServiceAreas
            } as SubunternehmerFormData
            : {
                vatId: companyData.vatId,
                phoneNumber: companyData.phoneNumber,
                contactEmail: companyData.contactEmail,
                industry: companyData.industry,
                preferredCargoTypes: selectedCargoTypes
            } as VersenderFormData
    });
    
    const onSubmit = (data: FormData) => {
        // Aktualisiere die lokalen Werte im Formular-Daten-Objekt
        if (isSubunternehmer) {
            (data as SubunternehmerFormData).vehicleTypes = selectedVehicleTypes;
            (data as SubunternehmerFormData).serviceAreas = selectedServiceAreas;
        } else {
            (data as VersenderFormData).preferredCargoTypes = selectedCargoTypes;
        }
        
        updateCompanyData(data);
        onNext();
    };

    // Handler für Fahrzeugtypen Checkboxen
    const handleVehicleTypeChange = (value: string, checked: boolean) => {
        let newValues;
        if (checked) {
            newValues = [...selectedVehicleTypes, value];
        } else {
            newValues = selectedVehicleTypes.filter(v => v !== value);
        }
        
        setSelectedVehicleTypes(newValues);
        updateCompanyData({ vehicleTypes: newValues });
    };
    
    // Handler für Servicegebiete Checkboxen
    const handleServiceAreaChange = (value: string, checked: boolean) => {
        let newValues;
        if (checked) {
            newValues = [...selectedServiceAreas, value];
        } else {
            newValues = selectedServiceAreas.filter(v => v !== value);
        }
        
        setSelectedServiceAreas(newValues);
        updateCompanyData({ serviceAreas: newValues });
    };
    
    // Handler für Frachttypen Checkboxen
    const handleCargoTypeChange = (value: string, checked: boolean) => {
        let newValues;
        if (checked) {
            newValues = [...selectedCargoTypes, value];
        } else {
            newValues = selectedCargoTypes.filter(v => v !== value);
        }
        
        setSelectedCargoTypes(newValues);
        updateCompanyData({ preferredCargoTypes: newValues });
    };
    
    return (
        <div>
            <h4 className="mb-4">Unternehmensdetails</h4>
            <p className="mb-6 text-gray-500">
                {isSubunternehmer
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
                
                {isSubunternehmer ? (
                    <>
                        <FormItem
                            label="Fahrzeugtypen"
                            invalid={isSubunternehmer && 
                                     selectedVehicleTypes.length === 0 && 
                                     Boolean(errors?.vehicleTypes)}
                            errorMessage={isSubunternehmer && 
                                          (errors as any)?.vehicleTypes?.message}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {vehicleOptions.map(option => (
                                    <div key={option.value} className="flex items-center mb-2">
                                        <input 
                                            type="checkbox"
                                            id={`vehicle-${option.value}`}
                                            className="mr-2 h-4 w-4 text-primary"
                                            checked={selectedVehicleTypes.includes(option.value)}
                                            onChange={(e) => handleVehicleTypeChange(option.value, e.target.checked)}
                                        />
                                        <label htmlFor={`vehicle-${option.value}`} className="ml-2">
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                        
                        <FormItem
                            label="Servicegebiete"
                            invalid={isSubunternehmer && 
                                     selectedServiceAreas.length === 0 && 
                                     Boolean(errors?.serviceAreas)}
                            errorMessage={isSubunternehmer && 
                                          (errors as any)?.serviceAreas?.message}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {stateOptions.map(option => (
                                    <div key={option.value} className="flex items-center mb-2">
                                        <input 
                                            type="checkbox"
                                            id={`area-${option.value}`}
                                            className="mr-2 h-4 w-4 text-primary"
                                            checked={selectedServiceAreas.includes(option.value)}
                                            onChange={(e) => handleServiceAreaChange(option.value, e.target.checked)}
                                        />
                                        <label htmlFor={`area-${option.value}`} className="ml-2">
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                    </>
                ) : (
                    <>
                        <FormItem
                            label="Branche"
                            invalid={!isSubunternehmer && Boolean(errors?.industry)}
                            errorMessage={!isSubunternehmer && (errors as any)?.industry?.message}
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
                            invalid={!isSubunternehmer && 
                                     selectedCargoTypes.length === 0 && 
                                     Boolean(errors?.preferredCargoTypes)}
                            errorMessage={!isSubunternehmer && 
                                          (errors as any)?.preferredCargoTypes?.message}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {cargoOptions.map(option => (
                                    <div key={option.value} className="flex items-center mb-2">
                                        <input 
                                            type="checkbox"
                                            id={`cargo-${option.value}`}
                                            className="mr-2 h-4 w-4 text-primary"
                                            checked={selectedCargoTypes.includes(option.value)}
                                            onChange={(e) => handleCargoTypeChange(option.value, e.target.checked)}
                                        />
                                        <label htmlFor={`cargo-${option.value}`} className="ml-2">
                                            {option.label}
                                        </label>
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