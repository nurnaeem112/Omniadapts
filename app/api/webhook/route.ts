import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Admin client for updating user data from webhooks
export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://nzknubmeznjlupcvvzag.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
    return new Response('Supabase admin key not configured', { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const signature = req.headers.get('polar-webhook-signature');
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('POLAR_WEBHOOK_SECRET is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody);
    console.log('Received Polar event:', event.type);

    if (event.type === 'order.created' || event.type === 'subscription.created') {
      const data = event.data;
      const userId = data.metadata?.userId;
      const planName = data.product?.name;

      if (userId) {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { plan: planName, subscription_status: 'active' }
        });

        if (error) {
          console.error('Error updating user in Supabase:', error);
        } else {
          console.log(`Successfully updated plan for user ${userId} to ${planName}`);
        }
      }
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
