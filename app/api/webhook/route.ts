import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check env vars
  if (!supabaseServiceKey) {
    console.error('[Webhook] SUPABASE_SERVICE_ROLE_KEY missing');
    return new Response('Missing service role key', { status: 500 });
  }

  if (!supabaseUrl) {
    console.error('[Webhook] NEXT_PUBLIC_SUPABASE_URL missing');
    return new Response('Missing Supabase URL', { status: 500 });
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey
  );

  // Read webhook body
  let rawBody: string;

  try {
    rawBody = await req.text();
  } catch (e: any) {
    console.error('[Webhook] Failed reading body:', e.message);
    return new Response('Failed reading body', { status: 400 });
  }

  // TEMP: Skip Polar signature validation
  let event: any;

  try {
    event = JSON.parse(rawBody);
  } catch (e: any) {
    console.error('[Webhook] Invalid JSON:', e.message);
    return new Response('Invalid JSON', { status: 400 });
  }

  console.log('[Webhook] Event type:', event.type);

  try {
    // checkout created
    if (event.type === 'checkout.created') {
      console.log('[Webhook] Checkout created');
      return new Response('Checkout received', { status: 200 });
    }

    // successful payment
    if (
      event.type === 'order.created' ||
      event.type === 'subscription.created' ||
      event.type === 'subscription.active'
    ) {
      const data = event.data;

      const userId =
        data.metadata?.userId ||
        data.customer?.metadata?.userId;

      const planName =
        data.product?.name || 'Pro';

      console.log('[Webhook] Updating user:', userId);

      if (!userId) {
        console.error('[Webhook] No userId found');
        return new Response('No userId', { status: 200 });
      }

      const { error } =
        await supabaseAdmin.auth.admin.updateUserById(
          userId,
          {
            user_metadata: {
              plan: planName,
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
            },
          }
        );

      if (error) {
        console.error('[Webhook] Supabase update failed:', error);

        return new Response(
          'Supabase update failed',
          { status: 500 }
        );
      }

      console.log('[Webhook] User upgraded');

      return new Response('User upgraded', {
        status: 200,
      });
    }

    return new Response('Unhandled event', {
      status: 200,
    });
  } catch (err: any) {
    console.error('[Webhook] Processing error:', err.message);

    return new Response(
      `Processing error: ${err.message}`,
      { status: 500 }
    );
  }
}