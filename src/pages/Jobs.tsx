import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { JobCard } from '@/components/JobCard';
import { useJobs } from '@/hooks/useJobs';
import { useUserApplications, useApplyToJob } from '@/hooks/useApplications';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Job } from '@/lib/types';
import { coverLetterSchema } from '@/lib/validations';
import { toast } from 'sonner';

const MAX_COVER_LETTER_LENGTH = 5000;

export default function Jobs() {
  const { data: jobs = [], isLoading } = useJobs();
  const { data: applications = [] } = useUserApplications();
  const applyMutation = useApplyToJob();
  
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [coverLetterError, setCoverLetterError] = useState('');

  const appliedJobIds = new Set(applications.map(a => a.job_id));

  const filteredJobs = jobs.filter(job => 
    job.is_active && (
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleCoverLetterChange = (value: string) => {
    // Enforce max length at input level
    if (value.length > MAX_COVER_LETTER_LENGTH) {
      value = value.slice(0, MAX_COVER_LETTER_LENGTH);
    }
    setCoverLetter(value);
    
    // Clear error when user is typing
    if (coverLetterError) {
      setCoverLetterError('');
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    
    // Validate cover letter
    const result = coverLetterSchema.safeParse(coverLetter);
    if (!result.success) {
      setCoverLetterError(result.error.errors[0]?.message || 'Invalid cover letter');
      toast.error('Please fix the validation error');
      return;
    }
    
    setCoverLetterError('');
    
    await applyMutation.mutateAsync({
      jobId: selectedJob.id,
      coverLetter: result.data || undefined,
    });
    
    setSelectedJob(null);
    setCoverLetter('');
  };

  const handleCloseDialog = () => {
    setSelectedJob(null);
    setCoverLetter('');
    setCoverLetterError('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Find your next opportunity
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            maxLength={200}
          />
        </div>

        {/* Jobs grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                hasApplied={appliedJobIds.has(job.id)}
                isApplying={applyMutation.isPending && selectedJob?.id === job.id}
                onApply={() => setSelectedJob(job)}
              />
            ))}
          </div>
        )}

        {/* Apply Dialog */}
        <Dialog open={!!selectedJob} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                at {selectedJob?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us why you're a great fit for this role..."
                  value={coverLetter}
                  onChange={(e) => handleCoverLetterChange(e.target.value)}
                  rows={5}
                  maxLength={MAX_COVER_LETTER_LENGTH}
                  className={coverLetterError ? 'border-destructive' : ''}
                />
                <div className="flex justify-between items-center">
                  {coverLetterError ? (
                    <p className="text-xs text-destructive">{coverLetterError}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {coverLetter.length}/{MAX_COVER_LETTER_LENGTH} characters
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                onClick={handleApply}
                disabled={applyMutation.isPending}
                className="gradient-primary"
              >
                {applyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
