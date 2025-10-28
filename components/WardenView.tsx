import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  setCutoffStatus,
  areSubmissionsOpen,
} from "../services/preferenceService";
import {
  Preference,
  PreferenceChoice,
  Department,
  Year,
  DailyCounts,
  AggregatedCounts,
  DepartmentCounts,
} from "../types";
import { DEPARTMENTS, YEARS } from "../constants";
import { ChevronDownIcon } from "./icons";

interface WardenViewProps {
  onLogout: () => void;
}

const preferenceDisplayMap: Record<PreferenceChoice, string> = {
  [PreferenceChoice.EGG]: "Needs Egg",
  [PreferenceChoice.SKIP_EGG]: "Skips Egg",
  [PreferenceChoice.VEG]: "Veg",
  [PreferenceChoice.NON_VEG]: "Non-Veg",
  [PreferenceChoice.SKIP_MEAL]: "Skips Meal",
};

const createEmptyDailyCounts = (): DailyCounts => ({
  egg: 0,
  veg: 0,
  nonVeg: 0,
  skipped: 0,
  total: 0,
});

const createInitialCounts = (): AggregatedCounts => {
  const counts = {} as AggregatedCounts;
  DEPARTMENTS.forEach((dept) => {
    counts[dept] = {
      years: {} as Record<Year, DailyCounts>,
      total: createEmptyDailyCounts(),
    };
    YEARS.forEach((year) => {
      counts[dept].years[year] = createEmptyDailyCounts();
    });
  });
  return counts;
};

interface DepartmentAccordionProps {
  department: Department;
  counts: DepartmentCounts;
  preferences: Preference[];
}

const DepartmentAccordion: React.FC<DepartmentAccordionProps> = ({
  department,
  counts,
  preferences,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 hover:bg-gray-50"
      >
        <span>{department}</span>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Total: {counts.total.total}
          </span>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg">
              <tr>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Egg</th>
                <th className="px-4 py-2">Veg</th>
                <th className="px-4 py-2">Non-Veg</th>
                <th className="px-4 py-2">Skipped</th>
                <th className="px-4 py-2 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {YEARS.map((year) => (
                <tr key={year} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{year}</td>
                  <td className="px-4 py-2">{counts.years[year].egg}</td>
                  <td className="px-4 py-2">{counts.years[year].veg}</td>
                  <td className="px-4 py-2">{counts.years[year].nonVeg}</td>
                  <td className="px-4 py-2">{counts.years[year].skipped}</td>
                  <td className="px-4 py-2 font-bold">
                    {counts.years[year].total}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="px-4 py-2">Dept. Total</td>
                <td className="px-4 py-2">{counts.total.egg}</td>
                <td className="px-4 py-2">{counts.total.veg}</td>
                <td className="px-4 py-2">{counts.total.nonVeg}</td>
                <td className="px-4 py-2">{counts.total.skipped}</td>
                <td className="px-4 py-2">{counts.total.total}</td>
              </tr>
            </tbody>
          </table>

          {preferences.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-800 border-b pb-2 mb-3">
                Student Submissions
              </h4>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {preferences.map((pref, index) => (
                  <li
                    key={index}
                    className="text-sm flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>
                      <span className="font-semibold text-gray-700">
                        {pref.identity.name}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ({pref.identity.year}
                        {pref.identity.year === 1
                          ? "st"
                          : pref.identity.year === 2
                          ? "nd"
                          : pref.identity.year === 3
                          ? "rd"
                          : "th"}{" "}
                        Year)
                      </span>
                    </span>
                    <span className="font-medium text-indigo-600 px-2 py-1 bg-indigo-50 rounded-md">
                      {preferenceDisplayMap[pref.choice]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-center text-gray-500 italic">
              No submissions from this department yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const WardenView: React.FC<WardenViewProps> = ({ onLogout }) => {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [submissionsOpen, setSubmissionsOpen] = useState(true);

  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA");
  const todayDisplay = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    // Live listener for today's preferences
    const q = query(collection(db, "preferences"), where("date", "==", todayString));
    const unsubscribePrefs = onSnapshot(q, (querySnapshot) => {
      const todaysPrefs: Preference[] = [];
      querySnapshot.forEach((docSnap) => {
        todaysPrefs.push(docSnap.data() as Preference);
      });
      setPreferences(todaysPrefs);
    });

    // Live listener for cutoff status
    const cutoffRef = doc(db, "settings", "cutoff");
    const unsubscribeCutoff = onSnapshot(cutoffRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSubmissionsOpen(data.submissionsOpen ?? true);
      } else {
        setSubmissionsOpen(true);
      }
    });

    return () => {
      unsubscribePrefs();
      unsubscribeCutoff();
    };
  }, [todayString]);

  const handleToggleSubmissions = async () => {
    const newStatus = !submissionsOpen;
    setSubmissionsOpen(newStatus);
    await setCutoffStatus(newStatus);
  };

  const { aggregatedCounts, grandTotal } = useMemo(() => {
    const counts = createInitialCounts();
    const total = createEmptyDailyCounts();

    preferences.forEach((pref) => {
      const { department, year } = pref.identity;
      if (counts[department] && counts[department].years[year]) {
        const yearCounts = counts[department].years[year];
        const deptTotal = counts[department].total;

        yearCounts.total++;
        deptTotal.total++;
        total.total++;

        switch (pref.choice) {
          case PreferenceChoice.EGG:
            yearCounts.egg++;
            deptTotal.egg++;
            total.egg++;
            break;
          case PreferenceChoice.VEG:
            yearCounts.veg++;
            deptTotal.veg++;
            total.veg++;
            break;
          case PreferenceChoice.NON_VEG:
            yearCounts.nonVeg++;
            deptTotal.nonVeg++;
            total.nonVeg++;
            break;
          case PreferenceChoice.SKIP_EGG:
          case PreferenceChoice.SKIP_MEAL:
            yearCounts.skipped++;
            deptTotal.skipped++;
            total.skipped++;
            break;
        }
      }
    });

    return { aggregatedCounts: counts, grandTotal: total };
  }, [preferences]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Warden Dashboard
          </h1>
          <p className="text-gray-500 mt-1">{todayDisplay}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Submission Status */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-gray-700">
            Submission Status:
            <span
              className={`ml-2 px-3 py-1 text-sm rounded-full ${
                submissionsOpen
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submissionsOpen ? "OPEN" : "CLOSED"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Close</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={submissionsOpen}
                onChange={handleToggleSubmissions}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600"></div>
              <div className="absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
            </label>
            <span className="text-sm text-gray-600">Open</span>
          </div>
        </div>
      </div>

      {/* Grand Totals */}
      <div className="bg-blue-50 p-4 rounded-lg shadow-inner mb-8">
        <h2 className="text-xl font-bold text-blue-800 mb-2">
          Grand Totals for Today
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-bold text-2xl">{grandTotal.total}</p>
            <p className="text-sm text-gray-600">Total Submissions</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-bold text-2xl">{grandTotal.egg}</p>
            <p className="text-sm text-gray-600">Eggs</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-bold text-2xl">{grandTotal.veg}</p>
            <p className="text-sm text-gray-600">Veg</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-bold text-2xl">{grandTotal.nonVeg}</p>
            <p className="text-sm text-gray-600">Non-Veg</p>
          </div>
          <div className="p-2 bg-white rounded shadow-sm">
            <p className="font-bold text-2xl">{grandTotal.skipped}</p>
            <p className="text-sm text-gray-600">Skipped</p>
          </div>
        </div>
      </div>

      {/* Department-wise breakdown */}
      <div>
        {DEPARTMENTS.map((dept) => (
          <DepartmentAccordion
            key={dept}
            department={dept}
            counts={aggregatedCounts[dept]}
            preferences={preferences.filter(
              (p) => p.identity.department === dept
            )}
          />
        ))}
      </div>
    </div>
  );
};
