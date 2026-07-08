export interface Company {
  id: number;
  name: string;
  logo_url: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  company_id: number;
  requirements: string;
  isOpen: boolean;
  recruiter_id: string;
  created_at: string;
  company: Company;
  applications: Application[];
  saved: { id: number }[];
}

export interface SavedJob {
  id: number;
  job_id: number;
  user_id: string;
  job: Job;
}

export interface Application {
  id: number;
  job_id: number;
  candidate_id: string;
  status: string;
  created_at: string;
}
