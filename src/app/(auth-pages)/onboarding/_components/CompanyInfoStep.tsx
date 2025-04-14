// src/app/(auth-pages)/onboarding/_components/CompanyInfoStep.tsx

import React from 'react';
import { CompanyData } from './OnboardingClient'; // Importiere den Typ oder definiere ihn hier

interface CompanyInfoStepProps {
    companyData: CompanyData;
    updateCompanyData: (data: Partial<CompanyData>) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ companyData, updateCompanyData, onSubmit, isSubmitting }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateCompanyData({ [name]: value });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [field, subField] = name.split('.');
        updateCompanyData({
            [field]: {
                ...companyData.address,
                [subField]: value,
            },
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            {/* Unternehmensname */}
            <label htmlFor="name">Unternehmensname</label>
            <input
                type="text"
                id="name"
                name="name"
                value={companyData.name}
                onChange={handleInputChange}
                required
            />

            {/* Adresse */}
            <label>Adresse</label>
            <input
                type="text"
                name="address.street"
                value={companyData.address.street}
                onChange={handleAddressChange}
                placeholder="Straße"
                required
            />
            <input
                type="text"
                name="address.zip"
                value={companyData.address.zip}
                onChange={handleAddressChange}
                placeholder="Postleitzahl"
                required
            />
            <input
                type="text"
                name="address.city"
                value={companyData.address.city}
                onChange={handleAddressChange}
                placeholder="Stadt"
                required
            />
            {/* Länder-Auswahl (vereinfacht) */}
            <select
                name="address.country"
                value={companyData.address.country}
                onChange={handleAddressChange}
            >
                <option value="Deutschland">Deutschland</option>
                {/* Weitere Länder nach Bedarf */}
            </select>

            {/* Hauptstandort-Checkbox */}
            <label>
                <input
                    type="checkbox"
                    name="isMainLocation"
                    checked={companyData.isMainLocation}
                    onChange={() => updateCompanyData({ isMainLocation: !companyData.isMainLocation })}
                />
                Hauptstandort
            </label>

            {/* USt-IdNr./Steuernummer */}
            <label htmlFor="vatId">USt-IdNr./Steuernummer</label>
            <input
                type="text"
                id="vatId"
                name="vatId"
                value={companyData.vatId}
                onChange={handleInputChange}
                required
            />

            {/* Telefonnummer */}
            <label htmlFor="phoneNumber">Telefonnummer</label>
            <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={companyData.phoneNumber}
                onChange={handleInputChange}
                required
            />

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Wird erstellt...' : 'Abschließen'}
            </button>

            {/* Ggf. "Zurück"-Button mit Logik zum Zurücksetzen des Typs */}
            {/* <button type="button" onClick={onBack}>Zurück</button> */}
        </form>
    );
};

export { CompanyInfoStep };