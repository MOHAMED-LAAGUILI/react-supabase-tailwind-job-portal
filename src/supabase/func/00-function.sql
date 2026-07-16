
/*
/database/functions add this to alow accessing user id between supabase and clerk
*/
SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
)::text;
