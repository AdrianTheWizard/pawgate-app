import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-04-10' });

const PRICES: Record<string, string> = {
  pro: Deno.env.get('STRIPE_PRICE_PRO') || '',       // fill in from Stripe dashboard
  complete: Deno.env.get('STRIPE_PRICE_COMPLETE') || '',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const _sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: { user } } = await _sb.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { plan, success_url, cancel_url } = await req.json();
  const priceId = PRICES[plan];
  if (!priceId) return new Response('Unknown plan', { status: 400 });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: success_url || 'https://pawgate.no?plan=success',
    cancel_url:  cancel_url  || 'https://pawgate.no',
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: { user_id: user.id, plan },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
