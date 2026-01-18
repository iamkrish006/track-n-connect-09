import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Application, ApplicationStatus, ApplicationStatusHistory } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export function useUserApplications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      // Query the applications table but only select fields that users should see
      // This excludes admin_note for security (sensitive internal notes)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          job_id,
          user_id,
          status,
          cover_letter,
          applied_at,
          updated_at,
          job:jobs(*)
        `)
        .eq('user_id', user!.id)
        .order('applied_at', { ascending: false });
      
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });

  // Real-time subscription for status updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-applications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
}

export function useAllApplications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['all-applications'],
    queryFn: async () => {
      const { data: apps, error } = await supabase
        .from('applications')
        .select(`*, job:jobs(*)`)
        .order('applied_at', { ascending: false });
      
      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(apps.map(a => a.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
      
      return apps.map(app => ({
        ...app,
        profile: profileMap.get(app.user_id),
      })) as Application[];
    },
  });

  // Real-time subscription for all applications
  useEffect(() => {
    const channel = supabase
      .channel('all-applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['all-applications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useApplicationStatusHistory(applicationId: string) {
  return useQuery({
    queryKey: ['application-history', applicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('application_status_history')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ApplicationStatusHistory[];
    },
    enabled: !!applicationId,
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }) => {
      // First insert the application
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          user_id: user!.id,
          job_id: jobId,
          cover_letter: coverLetter,
        }])
        .select()
        .single();
      
      if (error) throw error;

      // Then create initial status history entry
      await supabase
        .from('application_status_history')
        .insert([{
          application_id: data.id,
          status: 'applied' as ApplicationStatus,
          note: 'Application submitted',
        }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('You have already applied to this job');
      } else {
        toast.error('Failed to submit application: ' + error.message);
      }
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      adminNote 
    }: { 
      applicationId: string; 
      status: ApplicationStatus;
      adminNote?: string;
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status,
          admin_note: adminNote,
        })
        .eq('id', applicationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-history'] });
      toast.success('Application status updated');
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    },
  });
}
