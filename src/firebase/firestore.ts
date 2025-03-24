import { db } from './firebase.config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';

// Benutzertypen
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  isOnboarded: boolean;
  companyId: string | null;
  createdAt: Timestamp;
}

// Unternehmenstypen
export type CompanyType = 'versender' | 'subunternehmer';

// Standort-Datenstruktur
export interface CompanyAddress {
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface CompanyLocation {
  id?: string; // Optional, wird bei der Erstellung generiert
  name: string; // z.B. "Hauptstandort", "Filiale Berlin", etc.
  address: CompanyAddress;
  isMain: boolean; // Kennzeichnet den Hauptstandort
  createdAt?: Timestamp; // Optional, wird bei der Erstellung gesetzt
}

export interface CompanyContactInfo {
  vatId: string;
  phoneNumber: string;
  email: string;
}

// Gemeinsame Basisschnittstelle für Unternehmen
interface BaseCompany {
  id: string;
  name: string;
  type: CompanyType;
  adminId: string;
  isApproved: boolean;
  createdAt: Timestamp;
  contactInfo: CompanyContactInfo;
}

// Spezifische Schnittstelle für Subunternehmer
interface SubcontractorCompany extends BaseCompany {
  type: 'subunternehmer';
  vehicleTypes: string[];
  serviceAreas: string[];
}

// Spezifische Schnittstelle für Versender
interface SenderCompany extends BaseCompany {
  type: 'versender';
  industry: string;
  preferredCargoTypes: string[];
}

// Kombinierte Schnittstelle für alle Unternehmenstypen
export type Company = SubcontractorCompany | SenderCompany;

// Benutzer-Dienste
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  return updateDoc(doc(db, 'users', userId), data);
};

// Unternehmens-Dienste
export const createCompany = async (
  companyData: Omit<Company, 'id' | 'createdAt'> & { locations: CompanyLocation[] }, 
  userId: string
): Promise<string> => {
  try {
    // Speichere die Standorte temporär und entferne sie aus den Unternehmensdaten
    const locations = companyData.locations;
    const { locations: _, ...companyDataWithoutLocations } = companyData;
    
    // Neuen Dokumentreferenz erstellen
    const companyRef = doc(collection(db, 'companies'));
    const companyId = companyRef.id;
    
    // Unternehmen ohne Standorte mit ID erstellen
    await setDoc(companyRef, {
      ...companyDataWithoutLocations,
      id: companyId,
      createdAt: Timestamp.now()
    });
    
    // Standorte in Subkollektion erstellen
    const locationsCollectionRef = collection(db, 'companies', companyId, 'locations');
    const batch = writeBatch(db);
    
    // Alle Standorte mit Batch hinzufügen
    for (const location of locations) {
      const locationRef = doc(locationsCollectionRef);
      batch.set(locationRef, {
        ...location,
        id: locationRef.id,
        createdAt: Timestamp.now()
      });
    }
    
    // Batch ausführen
    await batch.commit();
    
    // User mit companyId aktualisieren
    await updateUser(userId, { 
      companyId,
      isOnboarded: true
    });
    
    return companyId;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

// Funktion zum Abrufen der Standorte eines Unternehmens
export const getCompanyLocations = async (companyId: string): Promise<CompanyLocation[]> => {
  try {
    const locationsRef = collection(db, 'companies', companyId, 'locations');
    const locationsSnapshot = await getDocs(locationsRef);
    return locationsSnapshot.docs.map(doc => doc.data() as CompanyLocation);
  } catch (error) {
    console.error('Error fetching company locations:', error);
    return [];
  }
};

// Funktion zum Abrufen eines einzelnen Standorts
export const getCompanyLocation = async (companyId: string, locationId: string): Promise<CompanyLocation | null> => {
  try {
    const locationRef = doc(db, 'companies', companyId, 'locations', locationId);
    const locationDoc = await getDoc(locationRef);
    if (locationDoc.exists()) {
      return locationDoc.data() as CompanyLocation;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company location:', error);
    return null;
  }
};

// Funktion zum Erstellen eines neuen Standorts
export const addCompanyLocation = async (companyId: string, location: Omit<CompanyLocation, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const locationRef = doc(collection(db, 'companies', companyId, 'locations'));
    await setDoc(locationRef, {
      ...location,
      id: locationRef.id,
      createdAt: Timestamp.now()
    });
    return locationRef.id;
  } catch (error) {
    console.error('Error adding company location:', error);
    throw error;
  }
};

// Funktion zum Aktualisieren eines Standorts
export const updateCompanyLocation = async (companyId: string, locationId: string, data: Partial<CompanyLocation>): Promise<void> => {
  try {
    const locationRef = doc(db, 'companies', companyId, 'locations', locationId);
    await updateDoc(locationRef, data);
  } catch (error) {
    console.error('Error updating company location:', error);
    throw error;
  }
};

// Funktion zum Löschen eines Standorts
export const deleteCompanyLocation = async (companyId: string, locationId: string): Promise<void> => {
  try {
    const locationRef = doc(db, 'companies', companyId, 'locations', locationId);
    await deleteDoc(locationRef);
  } catch (error) {
    console.error('Error deleting company location:', error);
    throw error;
  }
};

export const getCompanyById = async (companyId: string): Promise<Company | null> => {
  try {
    const companyDoc = await getDoc(doc(db, 'companies', companyId));
    if (companyDoc.exists()) {
      return companyDoc.data() as Company;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
};

export const approveCompany = async (companyId: string): Promise<void> => {
  return updateDoc(doc(db, 'companies', companyId), {
    isApproved: true
  });
}; 