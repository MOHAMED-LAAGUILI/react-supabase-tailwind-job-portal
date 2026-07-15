export interface Company {
  id: number;
  logo_url: string;
  name: string;
}

export interface Job {
  applications: Application[];
  company: Company;
  company_id: number;
  country_code?: string;
  created_at: string;
  description: string;
  id: number;
  isOpen: boolean;
  location: string;
  recruiter_id: string;
  requirements: string;
  saved: { id: number }[];
  title: string;
}

export interface SavedJob {
  id: number;
  job: Job;
  job_id: number;
  user_id: string;
}

export interface Application {
  created_at: string;
  id: number;
  job_id: number;
  status: string;
  user_id: string;
}
