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
  Timestamp 
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

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  adminId: string;
  isApproved: boolean;
  createdAt: Timestamp;
  // Weitere Unternehmensfelder können hier hinzugefügt werden
}

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
export const createCompany = async (companyData: Omit<Company, 'id' | 'createdAt'>, userId: string): Promise<string> => {
  try {
    // Neuen Dokumentreferenz erstellen
    const companyRef = doc(collection(db, 'companies'));
    const companyId = companyRef.id;
    
    // Unternehmen mit ID erstellen
    await setDoc(companyRef, {
      ...companyData,
      id: companyId,
      createdAt: Timestamp.now()
    });
    
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