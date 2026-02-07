'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function RemindersPage() {
  const router = useRouter();
  const { user, profile, loading, updateProfile, refreshProfile } = useAuth();
  const [reminderWeekly, setReminderWeekly] = useState(false);
  const [reminderMonthly, setReminderMonthly] = useState(false);
  const [reminderPriceDrop, setReminderPriceDrop] = useState(true);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (profile) {
      const hasWeekly = profile.reminder_weekly === true;
      const hasMonthly = profile.reminder_monthly === true;
      const defaultMonthly = profile.reminder_monthly === undefined && !hasWeekly;

      setReminderWeekly(hasWeekly);
      setReminderMonthly(hasWeekly ? false : hasMonthly || defaultMonthly);
      setReminderPriceDrop(profile.reminder_price_drop !== false);
      setProfileLoaded(true);
    }
  }, [profile, user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [loading, user, router]);

  const onReminderFrequencyChange = (value: string) => {
    if (value === 'weekly') {
      setReminderWeekly(true);
      setReminderMonthly(false);
    } else if (value === 'monthly') {
      setReminderWeekly(false);
      setReminderMonthly(true);
    } else if (value === 'never') {
      setReminderWeekly(false);
      setReminderMonthly(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    try {
      const payload = {
        reminder_weekly: reminderWeekly,
        reminder_monthly: reminderMonthly,
        reminder_price_drop: reminderPriceDrop,
      };
      
      await updateProfile(payload);
      console.log('Reminders saved with payload:', payload);
      
      // Refresh profile to ensure we have the latest data
      await refreshProfile();
      
      setMessage('✅ Reminder preferences updated successfully!');
      setSaving(false);
    } catch (err: any) {
      console.error('Save error:', err);
      setMessage(err?.message || 'Failed to update reminders.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
              🔔 Crypto Purchase Reminders
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Please log in or register to manage your crypto purchase reminders.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <a
              href="/auth/login"
              className="px-6 py-3 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
            >
              Log In
            </a>
            <a
              href="/auth/register"
              className="px-6 py-3 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
            >
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-12">
        <div
          className="max-w-2xl mx-auto rounded-2xl border p-8"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: '#dc2626' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              🔔 Crypto Purchase Reminders
            </h1>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{ 
                color: 'var(--accent)',
                backgroundColor: 'transparent',
                border: '1px solid var(--accent)'
              }}
            >
              ← Back to Home
            </button>
          </div>

          {/* Important Notice */}
          <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '2px solid #dc2626' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#dc2626' }}>
              ⚠️ This is the MOST important part
            </h2>
            <div className="space-y-3 text-sm" style={{ color: 'var(--foreground)' }}>
              <p>
                <strong>Building wealth with crypto requires consistency.</strong> The most successful investors are those who stick to their plan and buy regularly — not those who try to time the market.
              </p>
              <p>
                These reminder emails are your secret weapon for building the habit. <strong>Make sure to prioritize them in your inbox</strong> so you never miss your scheduled purchase window.
              </p>
              <p className="font-semibold" style={{ color: '#dc2626' }}>
                💡 Pro tip: Create an inbox filter to highlight these emails, add them to your calendar, or set them as VIP.
              </p>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(220, 38, 38, 0.3)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  🚀 <strong>Coming soon:</strong> SMS and WhatsApp notifications to make sure you never miss a purchase reminder.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Purchase Frequency Reminders */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Regular Purchase Reminders
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Choose how often you want to be reminded to buy crypto. Consistent investing is the key to building wealth over time.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="reminder_never"
                    name="reminder_frequency"
                    value="never"
                    checked={!reminderWeekly && !reminderMonthly}
                    onChange={(e) => onReminderFrequencyChange(e.target.value)}
                    disabled={!profileLoaded || saving}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="reminder_never" className="text-sm cursor-pointer" style={{ color: 'var(--foreground)' }}>
                    Never <span style={{ color: '#dc2626' }}>(⚠️ not recommended - you'll miss out on habit building)</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <input
                    type="radio"
                    id="reminder_weekly"
                    name="reminder_frequency"
                    value="weekly"
                    checked={reminderWeekly}
                    onChange={(e) => onReminderFrequencyChange(e.target.value)}
                    disabled={!profileLoaded || saving}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="reminder_weekly" className="text-sm cursor-pointer flex-1" style={{ color: 'var(--foreground)' }}>
                    <strong>Once a week</strong> (every Monday) <span style={{ color: '#3b82f6' }}>🔥 RECOMMENDED</span>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Perfect for dollar-cost averaging and building a strong investment habit
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <input
                    type="radio"
                    id="reminder_monthly"
                    name="reminder_frequency"
                    value="monthly"
                    checked={reminderMonthly}
                    onChange={(e) => onReminderFrequencyChange(e.target.value)}
                    disabled={!profileLoaded || saving}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="reminder_monthly" className="text-sm cursor-pointer flex-1" style={{ color: 'var(--foreground)' }}>
                    <strong>Once a month</strong> (1st of each month) <span style={{ color: '#22c55e' }}>⭐ POPULAR</span>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Great for monthly budgeters and long-term holders
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Opportunistic Reminders */}
            <div className="pt-6" style={{ borderTop: '1px solid var(--card-border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Opportunistic Buy Alerts
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Get notified when there might be a good buying opportunity.
              </p>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="reminder_price_drop"
                  name="reminder_price_drop"
                  checked={reminderPriceDrop}
                  onChange={(e) => setReminderPriceDrop(e.target.checked)}
                  disabled={!profileLoaded || saving}
                  className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="reminder_price_drop" className="text-sm cursor-pointer" style={{ color: 'var(--foreground)' }}>
                  Alert me after sharp price drops (more than 10%) <span style={{ color: 'var(--accent)' }}>📉 Buy the dip</span>
                </label>
              </div>
            </div>

            {message && (
              <div className="rounded-lg border p-4 text-sm" style={{ 
                borderColor: message.includes('✅') ? '#22c55e' : 'var(--card-border)', 
                backgroundColor: message.includes('✅') ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                color: 'var(--foreground)' 
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={!profileLoaded || saving}
              className="w-full rounded-lg px-4 py-3 text-white font-bold disabled:opacity-50 transition-all hover:scale-105"
              style={{ backgroundColor: '#dc2626' }}
            >
              {saving ? 'Saving...' : '💾 Save Reminder Preferences'}
            </button>
          </form>

          {/* Footer Tips */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--card-border)' }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              💡 Tips for Success
            </h4>
            <ul className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <li>• Set up inbox filters to make sure these emails stand out</li>
              <li>• Add purchase days to your calendar as recurring events</li>
              <li>• Consider automating your purchases once you're comfortable</li>
              <li>• Stay consistent — wealth building is a marathon, not a sprint</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
