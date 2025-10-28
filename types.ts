export enum Department {
  CSE = 'Computer Science',
  ECE = 'Electronics & Communication',
  EEE = 'Electrical & Electronics',
  MECH = 'Mechanical',
  IT = 'Information Technology',
  AIDS = 'Artificial Intelligence & Data Science',
  MBA = 'MBA',
}

export enum Year {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
}

export interface UserIdentity {
  department: Department;
  year: Year;
  name: string;
}

export enum PreferenceChoice {
  EGG = 'EGG',
  SKIP_EGG = 'SKIP_EGG',
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
  SKIP_MEAL = 'SKIP_MEAL',
}

export interface Preference {
  identity: UserIdentity;
  choice: PreferenceChoice;
  date: string; // YYYY-MM-DD
  day: number; // 0 for Sunday, 1 for Monday, etc.
}

export interface DailyCounts {
  egg: number;
  veg: number;
  nonVeg: number;
  skipped: number;
  total: number;
}

export type CountsByYear = Record<Year, DailyCounts>;

export interface DepartmentCounts {
  years: CountsByYear;
  total: DailyCounts;
}

export type AggregatedCounts = Record<Department, DepartmentCounts>;
