import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusTimeline } from '@/components/StatusTimeline';
import { useUserApplications, useApplicationStatusHistory } from '@/hooks/useApplications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Building2, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { JOB_TYPE_LABELS, WORK_LOCATION_LABELS } from '@/lib/types';

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: applications = [], isLoading: appsLoading } = useUserApplications();
  const { data: history = [], isLoading: historyLoading } = useApplicationStatusHistory(id!);

  const application = applications.find(a => a.id === id);
  const job = application?.job;

  const isLoading = appsLoading || historyLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!application || !job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Application not found</p>
          <Button asChild>
            <Link to="/applications">Back to Applications</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild>
          <Link to="/applications" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <StatusBadge status={application.status} className="text-base px-4 py-1.5" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{JOB_TYPE_LABELS[job.job_type]}</Badge>
                  <Badge variant="outline">{WORK_LOCATION_LABELS[job.work_location]}</Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                  )}
                  {job.salary_range && (
                    <span>{job.salary_range}</span>
                  )}
                  {job.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>

                {job.requirements && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cover letter */}
            {application.cover_letter && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Status Timeline */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline 
                  history={history} 
                  currentStatus={application.status} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Applied {format(new Date(application.applied_at), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last updated {format(new Date(application.updated_at), 'MMMM d, yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
