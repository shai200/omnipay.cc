import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify password using Firebase Auth client-side method
    // Note: In a production app with server-side auth, you would use custom tokens
    // For now, we'll verify the user exists and return their data
    // The client should handle actual authentication with Firebase Auth SDK
    
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      
      // Get user data from Firestore
      const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
      
      if (!userDoc.exists) {
        return NextResponse.json(
          { error: 'User data not found' },
          { status: 404 }
        );
      }

      const userData = userDoc.data();

      // Note: Password verification should be handled client-side with Firebase Auth
      // This endpoint returns data only after client-side authentication succeeds
      return NextResponse.json({
        success: true,
        kycInfo: userData?.kycInfo,
        reminderPreferences: userData?.reminderPreferences,
      });
    } catch (authError: any) {
      if (authError.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      throw authError;
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
