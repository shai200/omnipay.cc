import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, sourceAmount, destinationCurrency, destinationNetwork, customerInformation } = body;

    console.log('Creating onramp session with params:', {
      walletAddress,
      sourceAmount,
      destinationCurrency,
      destinationNetwork,
      hasCustomerInfo: !!customerInformation
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

    // Add customer information for pre-filling KYC data
    if (customerInformation) {
      if (customerInformation.email) {
        formData.append('customer_information[email]', customerInformation.email);
      }
      if (customerInformation.firstName) {
        formData.append('customer_information[first_name]', customerInformation.firstName);
      }
      if (customerInformation.lastName) {
        formData.append('customer_information[last_name]', customerInformation.lastName);
      }
      if (customerInformation.dob) {
        formData.append('customer_information[dob][year]', customerInformation.dob.year.toString());
        formData.append('customer_information[dob][month]', customerInformation.dob.month.toString());
        formData.append('customer_information[dob][day]', customerInformation.dob.day.toString());
      }
      if (customerInformation.address) {
        const addr = customerInformation.address;
        if (addr.country) formData.append('customer_information[address][country]', addr.country);
        if (addr.line1) formData.append('customer_information[address][line1]', addr.line1);
        if (addr.line2 !== undefined && addr.line2 !== null && addr.line2 !== '') {
          formData.append('customer_information[address][line2]', addr.line2);
        }
        if (addr.city) formData.append('customer_information[address][city]', addr.city);
        if (addr.state) formData.append('customer_information[address][state]', addr.state);
        if (addr.postalCode) formData.append('customer_information[address][postal_code]', addr.postalCode);
      }
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
