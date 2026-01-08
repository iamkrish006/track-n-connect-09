import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useJob, useCreateJob, useUpdateJob } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { JobType, WorkLocation, JOB_TYPE_LABELS, WORK_LOCATION_LABELS } from '@/lib/types';

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: job, isLoading } = useJob(id || '');
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();

  const [form, setForm] = useState({
    title: '', company: '', description: '', requirements: '', location: '',
    work_location: 'on_site' as WorkLocation, job_type: 'full_time' as JobType,
    salary_range: '', deadline: '', is_active: true,
  });

  useEffect(() => {
    if (job) setForm({ ...form, ...job, deadline: job.deadline?.split('T')[0] || '' });
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, deadline: form.deadline || undefined, requirements: form.requirements || undefined };
    if (isEdit) await updateMutation.mutateAsync({ id, ...data });
    else await createMutation.mutateAsync(data);
    navigate('/admin/jobs');
  };

  if (isEdit && isLoading) return <DashboardLayout><div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Job' : 'Post New Job'}</h1>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Job Title *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
                <div className="space-y-2"><Label>Company *</Label><Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} required /></div>
              </div>
              <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} required /></div>
              <div className="space-y-2"><Label>Requirements</Label><Textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} rows={3} /></div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
                <div className="space-y-2"><Label>Job Type</Label><Select value={form.job_type} onValueChange={v => setForm({...form, job_type: v as JobType})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(JOB_TYPE_LABELS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Work Location</Label><Select value={form.work_location} onValueChange={v => setForm({...form, work_location: v as WorkLocation})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(WORK_LOCATION_LABELS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Salary Range</Label><Input value={form.salary_range} onChange={e => setForm({...form, salary_range: e.target.value})} placeholder="e.g. $50k - $70k" /></div>
                <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>Active</Label></div>
              <Button type="submit" className="gradient-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Update Job' : 'Create Job'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
