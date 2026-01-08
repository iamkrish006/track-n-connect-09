import { DashboardLayout } from '@/components/DashboardLayout';
import { useJobs, useDeleteJob } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { JOB_TYPE_LABELS } from '@/lib/types';
import { format } from 'date-fns';

export default function AdminJobs() {
  const { data: jobs = [], isLoading } = useJobs();
  const deleteMutation = useDeleteJob();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Jobs</h1>
            <p className="text-muted-foreground mt-1">Create and manage job postings</p>
          </div>
          <Button asChild className="gradient-primary">
            <Link to="/admin/jobs/new"><Plus className="mr-2 h-4 w-4" />Post New Job</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : jobs.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No jobs posted yet</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge variant={job.is_active ? 'default' : 'secondary'}>{job.is_active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.company} • {JOB_TYPE_LABELS[job.job_type]} • Posted {format(new Date(job.created_at), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild><Link to={`/admin/jobs/${job.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                    <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(job.id)} disabled={deleteMutation.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
