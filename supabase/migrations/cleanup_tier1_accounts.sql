-- Function to delete unverified accounts older than 48 hours (haven't paid $1)
CREATE OR REPLACE FUNCTION cleanup_tier1_accounts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
    user_ids UUID[];
BEGIN
    -- Bypass RLS for this operation
    SET LOCAL row_security = off;
    
    -- Get user IDs to delete (accounts with status a7F9xQ2mP6kM4rT5 for more than 48 hours)
    SELECT ARRAY(
        SELECT user_id FROM profiles 
        WHERE account_status = 'a7F9xQ2mP6kM4rT5' 
        AND created_at < NOW() - INTERVAL '48 hours'
    ) INTO user_ids;
    
    -- Delete profiles first
    DELETE FROM profiles 
    WHERE account_status = 'a7F9xQ2mP6kM4rT5' 
    AND created_at < NOW() - INTERVAL '48 hours';
    
    -- Get count
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete corresponding auth users (if any)
    IF array_length(user_ids, 1) > 0 THEN
        DELETE FROM auth.users 
        WHERE id = ANY(user_ids);
    END IF;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- To run automatically, call this function from your application:
-- SELECT cleanup_tier1_accounts();
-- 
-- Or set up a cron job in your hosting environment to call:
-- curl -X POST 'your-supabase-url/rest/v1/rpc/cleanup_tier1_accounts' -H 'apikey: your-key'