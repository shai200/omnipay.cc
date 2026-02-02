import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';
import { UserData } from '@/app/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, kycInfo, reminderPreferences } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email,
        password,
        emailVerified: false,
      });
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
      throw authError;
    }

    // Store user data in Firestore (without SSN)
    const userData: UserData = {
      email,
      kycInfo: {
        email,
        firstName: kycInfo.firstName,
        lastName: kycInfo.lastName,
        dob: kycInfo.dob,
        address: kycInfo.address,
      },
      reminderPreferences,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    return NextResponse.json({
      success: true,
      userId: userRecord.uid,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
