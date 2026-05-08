import { createClient } from '@supabase/supabase-js';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  // --- Pre-flight config checks ---
  if (!supabaseServiceKey) {
    console.error('[Webhook] FATAL: SUPABASE_SERVICE_ROLE_KEY is not set');
    return new Response('Supabase admin key not configured', { status: 500 });
  }
  if (!webhookSecret) {
    console.error('[Webhook] FATAL: POLAR_WEBHOOK_SECRET is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (e: any) {
    console.error('[Webhook] Failed to read request body:', e.message);
    return new Response('Failed to read body', { status: 400 });
  }

  // Build headers map for signature verification
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Validate the webhook signature
  let event: any;
  try {
    event = validateEvent(rawBody, headers, webhookSecret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error('[Webhook] Signature verification failed — check POLAR_WEBHOOK_SECRET matches Polar dashboard');
      return new Response('Invalid signature', { status: 401 });
    }
    console.error('[Webhook] Unexpected error during validation:', error);
    return new Response('Validation error', { status: 400 });
  }

  console.log('[Webhook] ✅ Event received — type:', event.type);
  console.log('[Webhook] Event data:', JSON.stringify(event.data, null, 2));

  try {
    // Handle checkout.created (Polar fires this when a checkout is created)
    if (event.type === 'checkout.created') {
      const data = event.data;
      const userId = data.metadata?.userId as string | undefined;
      const planName = data.productName || data.product?.name || 'Unknown Plan';
      console.log('[Webhook] checkout.created — userId:', userId, '| plan:', planName);
      // Checkout is not yet paid — no subscription update needed here.
      // We'll upgrade the account on order.created / subscription.created.
    }

    // Handle successful payment — upgrade user plan
    else if (
      event.type === 'order.created' ||
      event.type === 'subscription.created' ||
      event.type === 'subscription.active'
    ) {
      const data = event.data;
      const userId = (data.metadata?.userId ||
        data.customer?.metadata?.userId) as string | undefined;
      const planName =
        data.productName ||
        data.product?.name ||
        data.items?.[0]?.productName ||
        'Pro';

      console.log('[Webhook] Payment event — userId:', userId, '| plan:', planName);

      if (!userId) {
        console.warn('[Webhook] ⚠️  No userId in metadata — cannot upgrade account');
        // Still return 200 so Polar stops retrying
        return new Response('No userId in metadata', { status: 200 });
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          plan: planName,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        },
      });

      if (updateError) {
        console.error('[Webhook] ❌ Failed to update user in Supabase:', updateError);
        // Return 500 so Polar retries
        return new Response('Failed to update user', { status: 500 });
      }

      console.log(`[Webhook] ✅ Upgraded user ${userId} to plan: ${planName}`);
    }

    // Handle subscription cancellation
    else if (
      event.type === 'subscription.canceled' ||
      event.type === 'subscription.revoked'
    ) {
      const data = event.data;
      const userId = (data.metadata?.userId ||
        data.customer?.metadata?.userId) as string | undefined;

      if (userId) {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            plan: 'Free',
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          },
        });
        console.log(`[Webhook] ✅ Downgraded user ${userId} to Free plan`);
      }
    }

    else {
      console.log('[Webhook] Unhandled event type:', event.type, '— ignoring');
    }
  } catch (err: any) {
    console.error('[Webhook] Error processing event:', err.message);
    return new Response(`Processing error: ${err.message}`, { status: 500 });
  }

  return new Response('OK', { status: 200 });
}

