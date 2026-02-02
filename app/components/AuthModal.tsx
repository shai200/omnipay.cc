'use client';

import { useState } from 'react';
import { UserKYCInfo, ReminderPreferences } from '../types/user';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (kycInfo: UserKYCInfo, reminderPrefs: ReminderPreferences) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // KYC form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [ssn, setSsn] = useState('');
  const [country, setCountry] = useState('US');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Reminder preferences
  const [monthly, setMonthly] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [afterMajorDrops, setAfterMajorDrops] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login flow - authenticate with Firebase first
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authError: any) {
          if (authError.code === 'auth/wrong-password' || authError.code === 'auth/user-not-found') {
            throw new Error('Invalid email or password');
          }
          throw new Error(authError.message || 'Authentication failed');
        }

        // After successful authentication, fetch user data
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Login failed');
        }

        const userData = await response.json();
        
        // Pre-fill form with user data
        if (userData.kycInfo) {
          setFirstName(userData.kycInfo.firstName);
          setLastName(userData.kycInfo.lastName);
          setDobYear(userData.kycInfo.dob.year.toString());
          setDobMonth(userData.kycInfo.dob.month.toString());
          setDobDay(userData.kycInfo.dob.day.toString());
          setCountry(userData.kycInfo.address.country);
          setLine1(userData.kycInfo.address.line1);
          setLine2(userData.kycInfo.address.line2 || '');
          setCity(userData.kycInfo.address.city);
          setState(userData.kycInfo.address.state);
          setPostalCode(userData.kycInfo.address.postalCode);
        }

        if (userData.reminderPreferences) {
          setMonthly(userData.reminderPreferences.monthly);
          setWeekly(userData.reminderPreferences.weekly);
          setAfterMajorDrops(userData.reminderPreferences.afterMajorDrops);
        }

        // Call onSuccess with the loaded data
        const kycInfo: UserKYCInfo = {
          email,
          firstName: userData.kycInfo.firstName,
          lastName: userData.kycInfo.lastName,
          dob: userData.kycInfo.dob,
          ssn: '', // SSN never stored/retrieved
          address: userData.kycInfo.address,
        };

        onSuccess(kycInfo, userData.reminderPreferences);
      } else {
        // Sign up flow - validate all required fields
        if (!email || !password || !firstName || !lastName || !dobYear || !dobMonth || !dobDay ||
            !country || !line1 || !city || !state || !postalCode) {
          throw new Error('Please fill in all required fields');
        }

        // Note: SSN is optional in storage but may be required by Stripe
        // We pass it to the widget but don't store it

        const kycInfo: UserKYCInfo = {
          email,
          firstName,
          lastName,
          dob: {
            year: parseInt(dobYear),
            month: parseInt(dobMonth),
            day: parseInt(dobDay),
          },
          ssn, // Passed to Stripe but not stored
          address: {
            country,
            line1,
            line2,
            city,
            state,
            postalCode,
          },
        };

        const reminderPrefs: ReminderPreferences = {
          monthly,
          weekly,
          afterMajorDrops,
        };

        // Register user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            kycInfo: {
              ...kycInfo,
              ssn: undefined, // Don't send SSN to backend
            },
            reminderPreferences: reminderPrefs,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Registration failed');
        }

        onSuccess(kycInfo, reminderPrefs);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email and Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* KYC Information - shown for signup or after login */}
          {!isLogin && (
            <>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date of Birth *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Year"
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Month"
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    min="1"
                    max="12"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Day"
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    min="1"
                    max="31"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  SSN (Required for Stripe, not stored)
                </label>
                <input
                  type="text"
                  value={ssn}
                  onChange={(e) => setSsn(e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Required by Stripe for KYC. Not stored in our database.
                </p>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Address
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Country *
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Reminder Preferences
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  How often would you like reminders to re-purchase crypto?
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={monthly}
                    onChange={(e) => setMonthly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Monthly</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weekly}
                    onChange={(e) => setWeekly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Weekly</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={afterMajorDrops}
                    onChange={(e) => setAfterMajorDrops(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">After Major Drops</span>
                </label>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
            >
              {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
