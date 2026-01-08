import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useUserApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: applications = [], isLoading: appsLoading } = useUserApplications();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();

  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(a => 
      ['applied', 'under_review'].includes(a.status)
    ).length,
    inProgress: applications.filter(a => 
      ['shortlisted', 'interview_scheduled'].includes(a.status)
    ).length,
    completed: applications.filter(a => 
      ['selected', 'rejected'].includes(a.status)
    ).length,
  };

  const recentApplications = applications.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your job applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalApplications}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-status-under-review" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Briefcase className="h-4 w-4 text-status-shortlisted" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-status-selected" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/applications" className="flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No applications yet</p>
                <Button asChild>
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    to={`/applications/${app.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{app.job?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {app.job?.company} • Applied {format(new Date(app.applied_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available jobs preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Available Jobs</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/jobs" className="flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {jobs.filter(j => j.is_active).length} active job openings
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
