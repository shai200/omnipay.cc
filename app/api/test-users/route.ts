import { NextResponse } from 'next/server';
import { adminApp, adminDb } from '@/lib/firebase-admin';

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Cameron'];
const lastNames = ['Smith', 'Johnson', 'Lee', 'Brown', 'Davis', 'Miller', 'Wilson', 'Anderson'];
const cities = ['New York', 'San Francisco', 'Seattle', 'Austin', 'Miami', 'Denver', 'Boston', 'Chicago'];

const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const generateUser = () => {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;

  return {
    username,
    email: `${username}@example.com`,
    firstName,
    lastName,
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    address: {
      street: `${Math.floor(1 + Math.random() * 999)} ${randomItem(lastNames)} St`,
      city: randomItem(cities),
      zip: `${Math.floor(10000 + Math.random() * 90000)}`,
    },
    createdAt: new Date().toISOString(),
  };
};

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countParam = searchParams.get('count');
    const count = Math.min(Math.max(Number(countParam) || 5, 1), 20);

    const batch = adminDb.batch();

    const newUsers = Array.from({ length: count }, () => generateUser());
    newUsers.forEach((user) => {
      const docRef = adminDb.collection('users').doc(`user_${user.username}`);
      batch.set(docRef, user);
    });

    await batch.commit();

    return NextResponse.json({
      ok: true,
      projectId: adminApp.options.projectId || null,
      collection: 'users',
      added: newUsers.map((u) => `user_${u.username}`),
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to add users' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam) || 5, 1), 50);

    const snapshot = await adminDb
      .collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({
      ok: true,
      projectId: adminApp.options.projectId || null,
      collection: 'users',
      users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
