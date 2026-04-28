import { NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
  server: (process.env.POLAR_ENV as 'sandbox' | 'production') || 'sandbox',
});

export async function POST(req: Request) {
  try {
    const { productId, userId, userEmail } = await req.json();

    console.log('--- Checkout Request ---');
    console.log('Product ID:', productId);
    console.log('User ID:', userId);
    console.log('User Email:', userEmail);

    if (!process.env.POLAR_ACCESS_TOKEN) {
      console.error('POLAR_ACCESS_TOKEN is not set');
      return NextResponse.json({ error: 'Polar Access Token is not configured' }, { status: 500 });
    }

    if (!productId || !userId) {
      console.error('Missing required fields:', { productId, userId });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
      if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
      return process.env.APP_URL || 'http://localhost:3000';
    };
    const baseUrl = getBaseUrl();
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const successUrl = `${normalizedBaseUrl}/profile?checkout=success`;

    console.log('Success URL:', successUrl);

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: successUrl,
      customerEmail: userEmail,
      metadata: {
        user_Id: userId,
      },
    });

    console.log('Checkout created successfully:', checkout.url);
    return NextResponse.json({ url: checkout.url });
  } catch (error: any) {
    console.error('--- Checkout Error ---');
    console.error('Error message:', error.message);

    if (error.response && typeof error.response.text === 'function') {
      try {
        const details = await error.response.text();
        console.error('Polar Response Error:', details);
      } catch (e) { }
    }

    return NextResponse.json({
      error: 'Failed to create checkout session',
      details: error?.message || 'Unknown server error'
    }, { status: 500 });
  }
}
