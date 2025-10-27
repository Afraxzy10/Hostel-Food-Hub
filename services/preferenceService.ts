import { Preference, UserIdentity } from '../types';

const PREFERENCES_KEY = 'hostelFoodPreferences';
const CUTOFF_ENABLED_KEY = 'hostelCutoffEnabled';

// === Preference Management ===

const getPreferences = (): Preference[] => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading preferences from localStorage", error);
    return [];
  }
};

const savePreferences = (preferences: Preference[]): void => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving preferences to localStorage", error);
  }
};

export const savePreference = (preference: Preference): void => {
  const allPreferences = getPreferences();
  // Create a unique key for each student to prevent duplicate submissions
  const studentKey = `${preference.identity.department}-${preference.identity.year}-${preference.identity.name || 'anonymous'}`;
  
  // Remove any previous submission from the same user for the same day
  const updatedPreferences = allPreferences.filter(
    p => {
        const pKey = `${p.identity.department}-${p.identity.year}-${p.identity.name || 'anonymous'}`;
        return !(p.date === preference.date && pKey === studentKey);
    }
  );

  updatedPreferences.push(preference);
  savePreferences(updatedPreferences);
};

export const getPreferencesForDate = (date: string): Preference[] => {
  return getPreferences().filter(p => p.date === date);
};

export const hasSubmittedToday = (identity: UserIdentity, date: string): boolean => {
  const todaysPreferences = getPreferencesForDate(date);
  const studentKey = `${identity.department}-${identity.year}-${identity.name || 'anonymous'}`;
  return todaysPreferences.some(
    p => {
        const pKey = `${p.identity.department}-${p.identity.year}-${p.identity.name || 'anonymous'}`;
        return pKey === studentKey;
    }
  );
};

// === Cutoff Time Management ===

export const setCutoffStatus = (isEnabled: boolean): void => {
  try {
    // We store the opposite: if cutoff is "enabled", submissions are "open".
    localStorage.setItem(CUTOFF_ENABLED_KEY, JSON.stringify(isEnabled));
  } catch (error) {
    console.error("Error saving cutoff status to localStorage", error);
  }
};

export const areSubmissionsOpen = (): boolean => {
  try {
    const stored = localStorage.getItem(CUTOFF_ENABLED_KEY);
    // Default to submissions being open if not set
    return stored ? JSON.parse(stored) : true;
  } catch (error) {
    console.error("Error reading cutoff status from localStorage", error);
    return true;
  }
};
