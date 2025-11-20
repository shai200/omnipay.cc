import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, sourceAmount, destinationCurrency, destinationNetwork } = body;

    console.log('Creating onramp session with params:', {
      walletAddress,
      sourceAmount,
      destinationCurrency,
      destinationNetwork
    });

    // Build the request body for Stripe API
    const formData = new URLSearchParams();

    // Only add wallet address if provided - let user enter it in the widget
    if (walletAddress) {
      formData.append('wallet_addresses[ethereum]', walletAddress);
    }

    if (sourceAmount) {
      formData.append('transaction_details[source_exchange_amount]', sourceAmount.toString());
      formData.append('transaction_details[source_currency]', 'usd');
    }

    if (destinationCurrency) {
      formData.append('transaction_details[destination_currency]', destinationCurrency);
    }

    if (destinationNetwork) {
      formData.append('transaction_details[destination_network]', destinationNetwork);
    }

    console.log('Making request to Stripe API...');

    // Make direct API call to Stripe
    const response = await fetch('https://api.stripe.com/v1/crypto/onramp_sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2024-11-20.acacia',
      },
      body: formData.toString(),
    });

    console.log('Stripe API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stripe API error:', errorData);

      // Provide more helpful error messages
      if (errorData.error?.type === 'invalid_request_error') {
        throw new Error(
          `Stripe Crypto Onramp API error: ${errorData.error.message}. ` +
          `This might mean:\n` +
          `1. Crypto onramp is not enabled on your Stripe account\n` +
          `2. Business name and URL need to be set in Stripe Dashboard\n` +
          `3. Your account needs approval for crypto onramp access\n` +
          `Request log: ${errorData.error.request_log_url || 'N/A'}`
        );
      }

      throw new Error(errorData.error?.message || 'Stripe API error');
    }

    const session = await response.json();
    console.log('Session created successfully:', session.id);

    return NextResponse.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Error creating onramp session:', error.message);
    return NextResponse.json(
      {
        error: error.message || 'Failed to create onramp session',
        details: 'Check server console for full error details'
      },
      { status: 500 }
    );
  }
}
