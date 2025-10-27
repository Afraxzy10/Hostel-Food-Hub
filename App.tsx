
import React, { useState } from 'react';
import { Department, Year, UserIdentity } from './types';
import { DEPARTMENTS, YEARS } from './constants';
import { StudentView } from './components/StudentView';
import { WardenView } from './components/WardenView';

type View = 'LOGIN' | 'STUDENT' | 'WARDEN';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LOGIN');
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [department, setDepartment] = useState<Department>(DEPARTMENTS[0]);
  const [year, setYear] = useState<Year>(YEARS[0]);
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  // State for warden password modal
  const [isWardenModalOpen, setIsWardenModalOpen] = useState(false);
  const [wardenPassword, setWardenPassword] = useState('');
  const [wardenError, setWardenError] = useState('');

  const handleStudentLogin = () => {
    if (!department || !year) {
        setError('Please select both department and year.');
        return;
    }
    const newIdentity: UserIdentity = { department, year, name: name.trim() || undefined };
    setIdentity(newIdentity);
    setView('STUDENT');
    setError('');
  };

  const handleWardenLogin = () => {
    setWardenError('');
    setWardenPassword('');
    setIsWardenModalOpen(true);
  };

  const handleWardenPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const WARDEN_PASSWORD = 'warden123'; // Hardcoded password
    if (wardenPassword === WARDEN_PASSWORD) {
        setView('WARDEN');
        setIsWardenModalOpen(false);
    } else {
        setWardenError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setView('LOGIN');
    setIdentity(null);
  };
  
  const renderLogin = () => (
    <>
        <div className="w-full max-w-md mx-auto p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Hostel Food Hub</h1>
                <p className="text-center text-gray-500 mb-8">Submit your daily meal preference</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value as Department)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                        >
                            {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                        <select
                            id="year"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value) as Year)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                        >
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (Optional)</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., John Doe"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                <div className="mt-8">
                    <button
                        onClick={handleStudentLogin}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Continue as Student
                    </button>
                </div>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleWardenLogin}
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        View Warden Dashboard
                    </button>
                </div>
            </div>
        </div>

        {isWardenModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                <div className="relative mx-auto p-8 border w-96 shadow-lg rounded-md bg-white">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Warden Login</h3>
                    <form onSubmit={handleWardenPasswordSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={wardenPassword}
                                onChange={(e) => setWardenPassword(e.target.value)}
                                className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                                autoFocus
                            />
                        </div>
                        {wardenError && <p className="text-red-500 text-sm mt-2">{wardenError}</p>}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsWardenModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      {view === 'LOGIN' && renderLogin()}
      {view === 'STUDENT' && identity && <StudentView identity={identity} onBack={handleLogout} />}
      {view === 'WARDEN' && <WardenView onLogout={handleLogout} />}
    </main>
  );
};

export default App;
