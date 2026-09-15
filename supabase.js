const SUPABASE_URL = "https://dnojapjtsgxsgmxxjhrp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "SUA_CHAVE_PUBLICA_AQUI";

console.log("SUPABASE_URL:", SUPABASE_URL);

window.supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase carregado:", !!window.supabaseClient);
