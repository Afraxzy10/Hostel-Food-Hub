// Fix: Use Firebase v8 compat syntax; remove v9 modular imports
import { Preference, UserIdentity } from '../types';
import { db } from './firebase';

const PREFERENCES_COLLECTION = 'preferences';
const SETTINGS_COLLECTION = 'settings';
const CUTOFF_DOC = 'cutoff';

// === Preference Management ===

export const savePreference = async (preference: Preference): Promise<void> => {
  // Create a unique ID for the document to prevent duplicate submissions
  const studentKey = `${preference.date}_${preference.identity.department}_${preference.identity.year}_${preference.identity.name.replace(/\s+/g, '_')}`;
  // Fix: Use Firebase v8 compat syntax
  const preferenceRef = db.collection(PREFERENCES_COLLECTION).doc(studentKey);

  try {
    // Fix: Use Firebase v8 compat syntax
    await preferenceRef.set(preference);
  } catch (error) {
    console.error("Error saving preference to Firestore", error);
  }
};

export const getPreferencesForDate = async (date: string): Promise<Preference[]> => {
  const preferences: Preference[] = [];
  // Fix: Use Firebase v8 compat syntax
  const q = db.collection(PREFERENCES_COLLECTION).where("date", "==", date);

  try {
    // Fix: Use Firebase v8 compat syntax
    const querySnapshot = await q.get();
    querySnapshot.forEach((doc) => {
      preferences.push(doc.data() as Preference);
    });
  } catch (error) {
    console.error("Error getting preferences from Firestore", error);
  }
  return preferences;
};


export const hasSubmittedToday = async (identity: UserIdentity, date: string): Promise<boolean> => {
    const studentKey = `${date}_${identity.department}_${identity.year}_${identity.name.replace(/\s+/g, '_')}`;
    // Fix: Use Firebase v8 compat syntax
    const q = db.collection(PREFERENCES_COLLECTION)
        .where("date", "==", date)
        .where("identity.department", "==", identity.department)
        .where("identity.year", "==", identity.year)
        .where("identity.name", "==", identity.name);

    try {
        // Fix: Use Firebase v8 compat syntax
        const querySnapshot = await q.get();
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking submission status", error);
        return false;
    }
};

// === Cutoff Time Management ===

export const setCutoffStatus = async (isEnabled: boolean): Promise<void> => {
  try {
    // Fix: Use Firebase v8 compat syntax
    const cutoffRef = db.collection(SETTINGS_COLLECTION).doc(CUTOFF_DOC);
    // Fix: Use Firebase v8 compat syntax
    await cutoffRef.set({ submissionsOpen: isEnabled });
  } catch (error) {
    console.error("Error saving cutoff status to Firestore", error);
  }
};

export const areSubmissionsOpen = async (): Promise<boolean> => {
    try {
        // Fix: Use Firebase v8 compat syntax for direct doc fetch
        const cutoffRef = db.collection(SETTINGS_COLLECTION).doc(CUTOFF_DOC);
        const docSnap = await cutoffRef.get();
        if (docSnap.exists) {
            // Fix: Use Firebase v8 compat syntax, data() is a method
            return docSnap.data()!.submissionsOpen;
        }
        // Default to submissions being open if not set
        return true;
    } catch (error) {
        console.error("Error reading cutoff status from Firestore", error);
        return true;
    }
};
