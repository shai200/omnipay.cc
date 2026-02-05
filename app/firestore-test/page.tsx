'use client';

import { useState } from 'react';

export default function FirestoreTest() {
  const [testData, setTestData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddRandomUsers = async () => {
    try {
      setLoading(true);
      setMessage('Adding 5 random users...');

      const response = await fetch('/api/test-users?count=5', { method: 'POST' });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || 'Failed to add users');
      }

      setMessage(`✓ Added users: ${data.added.join(', ')}`);
    } catch (error: any) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieveUsers = async () => {
    try {
      setLoading(true);
      setMessage('Retrieving latest users...');

      const response = await fetch('/api/test-users?limit=5');
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || 'Failed to fetch users');
      }

      setTestData(data.users || []);
      setMessage(`✓ Retrieved ${data.users?.length || 0} user(s)`);
    } catch (error: any) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
          Firestore Test
        </h1>

        <div className="space-y-4">
          {/* Add Users */}
          <div 
            className="border rounded-lg p-6"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Add Random Users
            </h2>
            <button
              onClick={handleAddRandomUsers}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {loading ? 'Adding...' : 'Add 5 Users'}
            </button>
          </div>

          {/* Retrieve Users */}
          <div 
            className="border rounded-lg p-6"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Retrieve Users
            </h2>
            <button
              onClick={handleRetrieveUsers}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {loading ? 'Retrieving...' : 'Get Latest 5'}
            </button>

            {testData.length > 0 && (
              <div className="mt-4">
                <p style={{ color: 'var(--text-secondary)' }}>
                  Found {testData.length} user(s):
                </p>
                <div className="mt-2 space-y-2">
                  {testData.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded border"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--card-border)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <p><strong>ID:</strong> {doc.id}</p>
                      <p><strong>Username:</strong> {doc.username}</p>
                      <p><strong>Email:</strong> {doc.email}</p>
                      <p><strong>Name:</strong> {doc.firstName} {doc.lastName}</p>
                      <p><strong>City:</strong> {doc.address?.city}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div 
              className="border rounded-lg p-4"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-secondary)'
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
