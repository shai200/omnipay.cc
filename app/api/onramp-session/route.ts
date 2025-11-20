import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, sourceAmount, destinationCurrency, destinationNetwork } = body;

    // Create the onramp session
    const session = await stripe.crypto.onrampSessions.create({
      wallet_addresses: {
        ethereum: walletAddress || '0xB00F0759DbeeF5E3Cc3E3B07A6442F5f3928a2',
      },
      ...(sourceAmount && {
        transaction_details: {
          source_amount: sourceAmount,
          source_currency: 'usd',
        }
      }),
      ...(destinationCurrency && {
        transaction_details: {
          destination_currency: destinationCurrency,
          ...(destinationNetwork && { destination_network: destinationNetwork }),
        }
      }),
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Error creating onramp session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create onramp session' },
      { status: 500 }
    );
  }
}
