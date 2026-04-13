import { NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
  server: (process.env.POLAR_ENV as 'sandbox' | 'production') || 'sandbox',
});

export async function POST(req: Request) {


  try {
    if (!process.env.POLAR_ACCESS_TOKEN) {
      console.error('POLAR_ACCESS_TOKEN is not set');
      return NextResponse.json({ error: 'Polar Access Token is not configured' }, { status: 500 });
    }

    const { productId, userId, userEmail } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL}/profile?checkout=success`,
      customerEmail: userEmail,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




