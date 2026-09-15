const SUPABASE_URL = "https://dnojapjtsgxsgmxxjhrp.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_zZy8CirGsWqjzYIv2GIanA_BQaASny8";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
