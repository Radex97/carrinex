'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import type { CompanyType } from '@/firebase/firestore'
import { useState } from 'react'

interface CompanyLocation {
    name: string;
    address: {
        street: string;
        city: string;
        zip: string;
        country: string;
    };
    isMain: boolean;
}

interface CompanyData {
    name: string
    type: CompanyType
    locations: CompanyLocation[];
}

interface CompanyInfoStepProps {
    companyData: CompanyData
    updateCompanyData: (data: Partial<CompanyData>) => void
    onNext: () => void
    onPrev: () => void
}

type FormData = {
    companyName: string;
    
    // Erste Adresse (entweder Hauptstandort oder Nebenstandort)
    street: string;
    city: string;
    zip: string;
    country: string;
    isNotMainLocation: boolean; // Checkbox: "Dies ist NICHT der Hauptstandort"
    locationName: string; // Bezeichnung für Nebenstandort
    
    // Hauptstandort-Adresse (nur sichtbar wenn isNotMainLocation = true)
    mainStreet: string;
    mainCity: string;
    mainZip: string;
    mainCountry: string;
}

const validationSchema = z.object({
    companyName: z.string().min(1, 'Bitte gib einen Firmennamen ein'),
    
    // Erste Adresse (immer erforderlich)
    street: z.string().min(1, 'Bitte gib eine Straße ein'),
    city: z.string().min(1, 'Bitte gib eine Stadt ein'),
    zip: z.string().min(4, 'Bitte gib eine gültige Postleitzahl ein'),
    country: z.string().min(1, 'Bitte gib ein Land ein'),
    isNotMainLocation: z.boolean(),
    locationName: z.string().optional(),
    
    // Hauptstandort-Adresse (bedingt erforderlich)
    mainStreet: z.string().optional(),
    mainCity: z.string().optional(),
    mainZip: z.string().optional(),
    mainCountry: z.string().optional(),
}).refine((data) => {
    // Wenn isNotMainLocation = true, dann müssen die Hauptstandortfelder ausgefüllt sein
    if (data.isNotMainLocation) {
        return data.locationName?.trim() !== '' && 
               data.mainStreet?.trim() !== '' && 
               data.mainCity?.trim() !== '' && 
               data.mainZip?.trim() !== '' && 
               data.mainCountry?.trim() !== '';
    }
    return true;
}, {
    message: 'Bei einem Nebenstandort müssen alle Hauptstandort-Felder ausgefüllt sein',
    path: ['mainStreet'],
});

export const CompanyInfoStep = ({
    companyData,
    updateCompanyData,
    onNext,
    onPrev
}: CompanyInfoStepProps) => {
    const [showMainLocationFields, setShowMainLocationFields] = useState(false);
    
    // Standardwerte aus den bestehenden Locations laden
    const getDefaultValues = () => {
        // Finde den Hauptstandort und den ersten Nebenstandort, falls vorhanden
        const mainLocation = companyData.locations.find(loc => loc.isMain) || { name: '', address: { street: '', city: '', zip: '', country: 'Deutschland' } };
        const otherLocation = companyData.locations.find(loc => !loc.isMain);
        
        // Wenn es einen Nebenstandort gibt, zeigen wir die Hauptstandortfelder an
        if (otherLocation) {
            setShowMainLocationFields(true);
            
            return {
                companyName: companyData.name,
                street: otherLocation.address.street,
                city: otherLocation.address.city,
                zip: otherLocation.address.zip,
                country: otherLocation.address.country,
                isNotMainLocation: true,
                locationName: otherLocation.name,
                mainStreet: mainLocation.address.street,
                mainCity: mainLocation.address.city,
                mainZip: mainLocation.address.zip,
                mainCountry: mainLocation.address.country,
            };
        }
        
        // Wenn nur ein Hauptstandort existiert
        return {
            companyName: companyData.name,
            street: mainLocation.address.street,
            city: mainLocation.address.city,
            zip: mainLocation.address.zip,
            country: mainLocation.address.country,
            isNotMainLocation: false,
            locationName: '',
            mainStreet: '',
            mainCity: '',
            mainZip: '',
            mainCountry: '',
        };
    };
    
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: getDefaultValues(),
    });
    
    // Überwachen des Checkbox-Status, um die zusätzlichen Felder anzuzeigen/auszublenden
    const isNotMainLocation = watch('isNotMainLocation');
    
    // Wenn sich der Checkbox-Status ändert, aktualisieren wir den State
    if (isNotMainLocation !== showMainLocationFields) {
        setShowMainLocationFields(isNotMainLocation);
    }
    
    const onSubmit = (data: FormData) => {
        // Standorte basierend auf den Formulardaten erstellen
        const locations: CompanyLocation[] = [];
        
        if (data.isNotMainLocation) {
            // Wenn es ein Nebenstandort ist, fügen wir zwei Standorte hinzu
            
            // Nebenstandort
            locations.push({
                name: data.locationName || 'Standort',
                address: {
                    street: data.street,
                    city: data.city,
                    zip: data.zip,
                    country: data.country
                },
                isMain: false
            });
            
            // Hauptstandort
            locations.push({
                name: 'Hauptstandort',
                address: {
                    street: data.mainStreet || '',
                    city: data.mainCity || '',
                    zip: data.mainZip || '',
                    country: data.mainCountry || ''
                },
                isMain: true
            });
        } else {
            // Wenn es nur ein Hauptstandort ist
            locations.push({
                name: 'Hauptstandort',
                address: {
                    street: data.street,
                    city: data.city,
                    zip: data.zip,
                    country: data.country
                },
                isMain: true
            });
        }
        
        // Daten an den übergeordneten Komponenten übermitteln
        updateCompanyData({
            name: data.companyName,
            locations: locations
        });
        
        onNext();
    };
    
    return (
        <div>
            <h4 className="mb-4">Unternehmensinformationen</h4>
            <p className="mb-6 text-gray-500">
                Gib die grundlegenden Informationen zu deinem Unternehmen ein.
            </p>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label="Unternehmensname"
                    invalid={Boolean(errors.companyName)}
                    errorMessage={errors.companyName?.message}
                >
                    <Controller
                        name="companyName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder="Unternehmensname"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                
                <div className="mt-6 mb-4">
                    <h5 className="font-medium">Adresse</h5>
                    <Controller
                        name="isNotMainLocation"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <Checkbox 
                                checked={value}
                                onChange={onChange}
                                className="mt-2"
                                {...field}
                            >
                                Dies ist NICHT der Hauptstandort
                            </Checkbox>
                        )}
                    />
                </div>
                
                {showMainLocationFields && (
                    <FormItem
                        label="Standortbezeichnung"
                        invalid={Boolean(errors.locationName)}
                        errorMessage={errors.locationName?.message}
                    >
                        <Controller
                            name="locationName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="z.B. Filiale Berlin"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="Straße"
                        invalid={Boolean(errors.street)}
                        errorMessage={errors.street?.message}
                    >
                        <Controller
                            name="street"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Straße und Hausnummer"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Stadt"
                        invalid={Boolean(errors.city)}
                        errorMessage={errors.city?.message}
                    >
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Stadt"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="Postleitzahl"
                        invalid={Boolean(errors.zip)}
                        errorMessage={errors.zip?.message}
                    >
                        <Controller
                            name="zip"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Postleitzahl"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Land"
                        invalid={Boolean(errors.country)}
                        errorMessage={errors.country?.message}
                    >
                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Land"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                
                {/* Hauptstandort-Felder, nur sichtbar wenn isNotMainLocation = true */}
                {showMainLocationFields && (
                    <>
                        <div className="mt-6 mb-4">
                            <h5 className="font-medium">Hauptstandort</h5>
                            <p className="text-sm text-gray-500">Bitte gib die Adresse des Hauptstandorts ein.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem
                                label="Straße"
                                invalid={Boolean(errors.mainStreet)}
                                errorMessage={errors.mainStreet?.message}
                            >
                                <Controller
                                    name="mainStreet"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Straße und Hausnummer"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Stadt"
                                invalid={Boolean(errors.mainCity)}
                                errorMessage={errors.mainCity?.message}
                            >
                                <Controller
                                    name="mainCity"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Stadt"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem
                                label="Postleitzahl"
                                invalid={Boolean(errors.mainZip)}
                                errorMessage={errors.mainZip?.message}
                            >
                                <Controller
                                    name="mainZip"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Postleitzahl"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Land"
                                invalid={Boolean(errors.mainCountry)}
                                errorMessage={errors.mainCountry?.message}
                            >
                                <Controller
                                    name="mainCountry"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            placeholder="Land"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </>
                )}
                
                <div className="flex justify-between mt-6">
                    <Button
                        type="button"
                        variant="plain"
                        onClick={onPrev}
                    >
                        Zurück
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                    >
                        Weiter
                    </Button>
                </div>
            </Form>
        </div>
    )
} 