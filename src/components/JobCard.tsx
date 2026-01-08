import { Job, JOB_TYPE_LABELS, WORK_LOCATION_LABELS } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building2, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  hasApplied?: boolean;
  isApplying?: boolean;
}

export function JobCard({ job, onApply, hasApplied, isApplying }: JobCardProps) {
  return (
    <Card className="group hover:shadow-soft transition-all duration-300 animate-fade-in">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{JOB_TYPE_LABELS[job.job_type]}</Badge>
            <Badge variant="outline">{WORK_LOCATION_LABELS[job.work_location]}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2">{job.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          )}
          {job.salary_range && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary_range}</span>
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Posted {format(new Date(job.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {onApply && (
          <Button
            onClick={onApply}
            disabled={hasApplied || isApplying}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
          >
            {hasApplied ? 'Already Applied' : isApplying ? 'Applying...' : 'Apply Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
