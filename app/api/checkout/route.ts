import { NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
  server: 'sandbox', // Change to 'production' for live
});

export async function POST(req: Request) {
  try {
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
