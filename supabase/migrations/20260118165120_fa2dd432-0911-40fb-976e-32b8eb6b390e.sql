-- Fix 1: Enable RLS on the applications_user_view 
-- Views with security_invoker=on inherit RLS from the base table when queried
-- But we should also add explicit policies for the view for defense in depth

-- Note: Views with security_invoker=on already apply RLS from base tables
-- The applications table already has proper RLS, so the view inherits that protection
-- However, let's verify and add additional protection

-- Fix 2: Add explicit policy to deny anonymous access to profiles table
-- The current policies are RESTRICTIVE which means they only RESTRICT authenticated access
-- We need to ensure anonymous users (unauthenticated) cannot access the table at all

-- First, let's add a permissive baseline policy that requires authentication
-- This ensures the table cannot be read by anonymous users at all

-- For profiles table - add authentication requirement
CREATE POLICY "Require authentication to access profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- For applications table - add authentication requirement  
CREATE POLICY "Require authentication to access applications"
ON public.applications
FOR ALL
TO anon
USING (false);

-- For application_status_history table - add authentication requirement
CREATE POLICY "Require authentication to access history"
ON public.application_status_history
FOR ALL
TO anon
USING (false);

-- For user_roles table - add authentication requirement
CREATE POLICY "Require authentication to access user roles"
ON public.user_roles
FOR ALL
TO anon
USING (false);