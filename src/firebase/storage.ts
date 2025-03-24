import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase.config';

/**
 * Lädt eine Datei in Firebase Storage hoch
 * @param file Die hochzuladende Datei
 * @param path Der Pfad im Storage, wohin die Datei hochgeladen werden soll
 * @returns URL der hochgeladenen Datei
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Erstelle eine Referenz zum Speicherort der Datei
    const storageRef = ref(storage, path);
    
    // Datei hochladen
    const snapshot = await uploadBytes(storageRef, file);
    
    // Download-URL abrufen
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Lädt das Profilbild eines Benutzers hoch
 * @param userId ID des Benutzers
 * @param file Das hochzuladende Profilbild
 * @returns URL des Profilbilds
 */
export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  // Generiere einen eindeutigen Pfad mit Zeitstempel, um Cache-Probleme zu vermeiden
  const timestamp = new Date().getTime();
  const path = `users/${userId}/profile_${timestamp}.${file.name.split('.').pop()}`;
  
  return uploadFile(file, path);
};

/**
 * Lädt ein Unternehmenslogo hoch
 * @param companyId ID des Unternehmens
 * @param file Das hochzuladende Logo
 * @returns URL des Logos
 */
export const uploadCompanyLogo = async (companyId: string, file: File): Promise<string> => {
  // Generiere einen eindeutigen Pfad mit Zeitstempel
  const timestamp = new Date().getTime();
  const path = `companies/${companyId}/logo_${timestamp}.${file.name.split('.').pop()}`;
  
  return uploadFile(file, path);
};

/**
 * Lädt ein Dokument hoch (z.B. Zertifikate, Verträge)
 * @param companyId ID des Unternehmens
 * @param file Das hochzuladende Dokument
 * @param category Kategorie des Dokuments (z.B. "certificates", "contracts")
 * @returns URL des Dokuments
 */
export const uploadDocument = async (
  companyId: string, 
  file: File, 
  category: string
): Promise<string> => {
  // Generiere einen eindeutigen Pfad mit Zeitstempel
  const timestamp = new Date().getTime();
  const path = `companies/${companyId}/${category}/${file.name}_${timestamp}.${file.name.split('.').pop()}`;
  
  return uploadFile(file, path);
};

/**
 * Löscht eine Datei aus Firebase Storage
 * @param url Die URL der zu löschenden Datei
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extrahiere den Pfad aus der URL
    const decodedUrl = decodeURIComponent(url);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const path = decodedUrl.substring(startIndex, endIndex);
    
    // Erstelle eine Referenz zur Datei
    const fileRef = ref(storage, path);
    
    // Lösche die Datei
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}; 