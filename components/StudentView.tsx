import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { UserIdentity, Preference, PreferenceChoice } from '../types';
import { savePreference, hasSubmittedToday, areSubmissionsOpen } from '../services/preferenceService';

interface StudentViewProps {
  identity: UserIdentity;
  onBack: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({ identity, onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissionsClosed, setSubmissionsClosed] = useState(true);

  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const todayString = now.toLocaleDateString('en-CA');

  useEffect(() => {
    const checkStatus = async () => {
        setLoading(true);
        const [hasSubmitted, isOpen] = await Promise.all([
            hasSubmittedToday(identity, todayString),
            areSubmissionsOpen()
        ]);
        setSubmitted(hasSubmitted);
        setSubmissionsClosed(!isOpen);
        setLoading(false);
    };
    checkStatus();
  }, [identity, todayString]);

  const handlePreferenceSubmit = async (choice: PreferenceChoice) => {
    if (submissionsClosed || submitted) return;

    const preference: Preference = {
      identity,
      choice,
      date: todayString,
      day,
    };
    await savePreference(preference);
    setSubmitted(true);
  };

  const renderOptions = () => {
    if (loading) {
        return <div className="text-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div></div>;
    }
    
    if (submitted) {
      return (
        <div className="text-center p-8">
          <h3 className="text-2xl font-bold text-green-600">Thank You!</h3>
          <p className="text-gray-600 mt-2">Your preference for today has been recorded.</p>
        </div>
      );
    }

    if (submissionsClosed) {
      return (
        <div className="text-center p-8">
          <h3 className="text-2xl font-bold text-red-600">Submissions Closed</h3>
          <p className="text-gray-600 mt-2">
            Submissions for today have been closed by the warden.
          </p>
        </div>
      );
    }
    
    // Tuesday (2) & Saturday (6)
    if (day === 2 || day === 6) {
      return (
        <div className="p-6">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">Today's Special: Egg</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => handlePreferenceSubmit(PreferenceChoice.EGG)} className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105">Need Egg</button>
            <button onClick={() => handlePreferenceSubmit(PreferenceChoice.SKIP_EGG)} className="w-full sm:w-auto bg-gray-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-600 transition-transform transform hover:scale-105">Skip Egg</button>
          </div>
        </div>
      );
    }
    
    // Thursday (4) & Sunday (0)
    if (day === 4 || day === 0) {
      return (
        <div className="p-6">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">Today's Menu Options</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => handlePreferenceSubmit(PreferenceChoice.VEG)} className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105">Veg</button>
            <button onClick={() => handlePreferenceSubmit(PreferenceChoice.NON_VEG)} className="w-full sm:w-auto bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105">Non-Veg</button>
            <button onClick={() => handlePreferenceSubmit(PreferenceChoice.SKIP_MEAL)} className="w-full sm:w-auto bg-gray-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-600 transition-transform transform hover:scale-105">Skip Meal</button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold text-indigo-600">Enjoy Your Meal!</h3>
        <p className="text-gray-600 mt-2">No special menu options to select for today.</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
       <div className="relative bg-white rounded-xl shadow-xl p-6 md:p-8">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">&larr; Back</button>
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Hi, {identity.name}!</h2>
            <p className="text-gray-500">{identity.year}{identity.year === 1 ? 'st' : identity.year === 2 ? 'nd' : identity.year === 3 ? 'rd' : 'th'} Year, {identity.department}</p>
        </div>
        <div className="bg-gray-50 rounded-lg">
            {renderOptions()}
        </div>
      </div>
    </div>
  );
};
