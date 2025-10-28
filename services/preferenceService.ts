// services/preferenceService.ts
import { db } from "../services/firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { Preference, UserIdentity } from "../types";

const PREFERENCES_COLLECTION = "preferences";
const SETTINGS_COLLECTION = "settings";
const CUTOFF_DOC = "cutoff";

// === Preference Management ===

export const savePreference = async (preference: Preference): Promise<void> => {
  try {
    const studentKey = `${preference.date}_${preference.identity.department}_${preference.identity.year}_${preference.identity.name.replace(/\s+/g, "_")}`;
    const preferenceRef = doc(db, PREFERENCES_COLLECTION, studentKey);
    await setDoc(preferenceRef, preference);
  } catch (error) {
    console.error("Error saving preference to Firestore:", error);
  }
};

export const getPreferencesForDate = async (date: string): Promise<Preference[]> => {
  const preferences: Preference[] = [];
  try {
    const q = query(collection(db, PREFERENCES_COLLECTION), where("date", "==", date));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      preferences.push(docSnap.data() as Preference);
    });
  } catch (error) {
    console.error("Error getting preferences from Firestore:", error);
  }
  return preferences;
};

export const hasSubmittedToday = async (identity: UserIdentity, date: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, PREFERENCES_COLLECTION),
      where("date", "==", date),
      where("identity.department", "==", identity.department),
      where("identity.year", "==", identity.year),
      where("identity.name", "==", identity.name)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking submission status:", error);
    return false;
  }
};

// === Cutoff Time Management ===

export const setCutoffStatus = async (isEnabled: boolean): Promise<void> => {
  try {
    const cutoffRef = doc(db, SETTINGS_COLLECTION, CUTOFF_DOC);
    await setDoc(cutoffRef, { submissionsOpen: isEnabled });
  } catch (error) {
    console.error("Error saving cutoff status:", error);
  }
};

export const areSubmissionsOpen = async (): Promise<boolean> => {
  try {
    const cutoffRef = doc(db, SETTINGS_COLLECTION, CUTOFF_DOC);
    const docSnap = await getDoc(cutoffRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.submissionsOpen ?? true;
    }
    return true; // default
  } catch (error) {
    console.error("Error reading cutoff status:", error);
    return true;
  }
};
