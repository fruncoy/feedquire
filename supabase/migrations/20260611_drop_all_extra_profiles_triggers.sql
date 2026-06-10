
-- DROP ALL TRIGGERS ON public.profiles EXCEPT on_auth_user_created (which is on auth.users anyway)
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN
        SELECT tgname
        FROM pg_trigger
        WHERE tgrelid::regclass::text = 'public.profiles'
        AND NOT tgisinternal
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trigger_rec.tgname) || ' ON public.profiles;';
        RAISE NOTICE 'Dropped trigger: %', trigger_rec.tgname;
    END LOOP;
END $$;
