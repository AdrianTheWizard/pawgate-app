import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const _sbAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  // Verify the calling user is authenticated
  const _sbUser = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: { user } } = await _sbUser.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { email, kennel_id, role } = await req.json();
  if (!email) return new Response('email required', { status: 400 });

  const { data, error } = await _sbAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: 'https://pawgate.no',
    data: { invited_by: user.id, kennel_id, role: role || 'tilsett' },
  });

  if (error) return new Response(error.message, { status: 400, headers: corsHeaders });

  return new Response(JSON.stringify({ ok: true, id: data.user?.id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
