import { DashboardLayout } from '@/components/DashboardLayout';
import { useAllApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, FileText, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data: applications = [] } = useAllApplications();
  const { data: jobs = [] } = useJobs();

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.is_active).length,
    totalApplications: applications.length,
    pendingReview: applications.filter(a => a.status === 'applied').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your recruitment pipeline</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
              <TrendingUp className="h-4 w-4 text-status-selected" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Users className="h-4 w-4 text-status-under-review" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingReview}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
