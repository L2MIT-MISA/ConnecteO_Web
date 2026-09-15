//http://192.168.11.65:8000
//http://100.103.0.49:8000
const { createClient } = supabase;
const URL_SUPABASE = "http://100.103.0.49:8000";
const CLE_PUBLIQUE_SUPABASE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5MjA5NzE4LCJleHAiOjIxMDQ1Njk3MTh9.8TqQreyifHorvHUkk6qdWM_GixbdXcmnvjcSt4UBkeI"
window.supabase= createClient(URL_SUPABASE, CLE_PUBLIQUE_SUPABASE);