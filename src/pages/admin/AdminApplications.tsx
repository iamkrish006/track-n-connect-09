import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAllApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ApplicationStatus, STATUS_CONFIG } from '@/lib/types';

export default function AdminApplications() {
  const { data: applications = [], isLoading } = useAllApplications();
  const updateStatus = useUpdateApplicationStatus();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const handleStatusChange = (appId: string, status: ApplicationStatus) => {
    updateStatus.mutate({ applicationId: appId, status });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground mt-1">Review and manage candidate applications</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No applications found</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{app.profile?.full_name || 'Unknown'}</h3>
                      <p className="text-sm text-muted-foreground">{app.profile?.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">Applied for <span className="font-medium">{app.job?.title}</span> at {app.job?.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(app.applied_at), 'MMM d, yyyy')}</p>
                    </div>
                    <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}>
                      <SelectTrigger className="w-48"><StatusBadge status={app.status} /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
