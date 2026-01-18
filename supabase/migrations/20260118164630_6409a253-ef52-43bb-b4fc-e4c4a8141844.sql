-- Fix admin notes exposure: Create a view for users that excludes admin_note
-- Users should query this view, not the applications table directly

-- Create a view for user applications that excludes admin_note
CREATE VIEW public.applications_user_view
WITH (security_invoker=on) AS
  SELECT 
    id,
    job_id,
    user_id,
    status,
    cover_letter,
    applied_at,
    updated_at
    -- admin_note is intentionally excluded to protect sensitive internal notes
  FROM public.applications;

-- Add comment explaining the view
COMMENT ON VIEW public.applications_user_view IS 'User-facing view of applications that excludes admin notes for privacy';

-- Fix jobs RLS: Change the public SELECT policy to be more explicit
-- Drop the current restrictive policy for public viewing
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;

-- Create a permissive policy for authenticated users to view active jobs
CREATE POLICY "Authenticated users can view active jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Create a permissive policy for anonymous users to view active jobs
CREATE POLICY "Anonymous users can view active jobs"
ON public.jobs
FOR SELECT
TO anon
USING (is_active = true);