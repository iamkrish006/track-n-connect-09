import { z } from 'zod';

// Job form validation schema
export const jobFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Job title is required')
    .max(200, 'Job title must be less than 200 characters'),
  company: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(10000, 'Description must be less than 10,000 characters'),
  requirements: z
    .string()
    .trim()
    .max(10000, 'Requirements must be less than 10,000 characters')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .trim()
    .max(200, 'Location must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  work_location: z.enum(['remote', 'on_site', 'hybrid']),
  job_type: z.enum(['full_time', 'part_time', 'internship', 'contract']),
  salary_range: z
    .string()
    .trim()
    .max(100, 'Salary range must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  deadline: z
    .string()
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
});

export type JobFormData = z.infer<typeof jobFormSchema>;

// Cover letter validation schema
export const coverLetterSchema = z
  .string()
  .trim()
  .max(5000, 'Cover letter must be less than 5,000 characters')
  .optional()
  .or(z.literal(''));

// Profile validation schema
export const profileFormSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(200, 'Full name must be less than 200 characters'),
  resume_url: z
    .string()
    .trim()
    .max(2000, 'Resume URL must be less than 2,000 characters')
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      'Resume URL must be a valid URL starting with http:// or https://'
    )
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Helper to validate and get error message
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.errors[0]?.message || 'Invalid input' };
}
