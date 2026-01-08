export type ApplicationStatus = 
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'selected'
  | 'rejected';

export type JobType = 'full_time' | 'part_time' | 'internship' | 'contract';

export type WorkLocation = 'remote' | 'on_site' | 'hybrid';

export type AppRole = 'admin' | 'user';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string | null;
  location: string | null;
  work_location: WorkLocation;
  job_type: JobType;
  salary_range: string | null;
  deadline: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  admin_note: string | null;
  applied_at: string;
  updated_at: string;
  job?: Job;
  profile?: Profile;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  status: ApplicationStatus;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  applied: { label: 'Applied', color: 'text-status-applied', bgColor: 'bg-status-applied/10' },
  under_review: { label: 'Under Review', color: 'text-status-under-review', bgColor: 'bg-status-under-review/10' },
  shortlisted: { label: 'Shortlisted', color: 'text-status-shortlisted', bgColor: 'bg-status-shortlisted/10' },
  interview_scheduled: { label: 'Interview Scheduled', color: 'text-status-interview', bgColor: 'bg-status-interview/10' },
  selected: { label: 'Selected', color: 'text-status-selected', bgColor: 'bg-status-selected/10' },
  rejected: { label: 'Rejected', color: 'text-status-rejected', bgColor: 'bg-status-rejected/10' },
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  internship: 'Internship',
  contract: 'Contract',
};

export const WORK_LOCATION_LABELS: Record<WorkLocation, string> = {
  remote: 'Remote',
  on_site: 'On-site',
  hybrid: 'Hybrid',
};
