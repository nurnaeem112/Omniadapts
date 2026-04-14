import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://nzknubmeznjlupcvvzag.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
    return new Response('Supabase admin key not configured', { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('POLAR_WEBHOOK_SECRET is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  try {
    const rawBody = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Validate the webhook signature
    let event;
    try {
      event = validateEvent(rawBody, headers, webhookSecret);
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        console.error('Webhook signature verification failed');
        return new Response('Invalid signature', { status: 401 });
      }
      throw error;
    }

    console.log('--- Polar Webhook Received ---');
    console.log('Event Type:', event.type);

    if (event.type === 'order.created' || event.type === 'subscription.created') {
      const data = event.data;
      // In Polar checkouts, we passed userId in metadata
      const userId = data.metadata?.userId;
      // Get plan name from the product
      const planName = data.product?.name;

      console.log('Processing payment for user:', userId, 'Plan:', planName);

      if (userId) {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { 
            plan: planName, 
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          }
        });

        if (error) {
          console.error('Error updating user in Supabase:', error);
        } else {
          console.log(`Successfully updated plan for user ${userId} to ${planName}`);
        }
      } else {
        console.warn('No userId found in webhook metadata');
      }
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err: any) {
    console.error('Webhook processing error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
