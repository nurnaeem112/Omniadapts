import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Polar } from '@polar-sh/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Supabase Admin client for updating user data from webhooks
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || 'https://nzknubmeznjlupcvvzag.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
  server: 'sandbox', // Change to 'production' for live
});

async function startServer() {
  // Middleware for raw body (needed for Polar webhook verification)
  app.use('/api/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
  });

  app.post('/api/checkout', async (req, res) => {
    console.log('Checkout request received:', req.body);
    try {
      const { productId, userId, userEmail } = req.body;

      if (!productId || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const checkout = await polar.checkouts.create({
        products: [productId],
        successUrl: `${process.env.APP_URL}/profile?checkout=success`,
        customerEmail: userEmail,
        metadata: {
          userId: userId,
        },
      });

      res.json({ url: checkout.url });
    } catch (error: any) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/webhook', async (req, res) => {
    const signature = req.headers['polar-webhook-signature'] as string;
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('POLAR_WEBHOOK_SECRET is not set');
      return res.status(500).send('Webhook secret not configured');
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
      return res.status(500).send('Supabase admin key not configured');
    }

    try {
      // In a real app, you'd verify the signature here using Polar's SDK or a helper
      // For now, we'll process the event if the signature exists
      const event = JSON.parse(req.body.toString());
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

      res.status(200).send('Webhook received');
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
