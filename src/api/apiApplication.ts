import { supabaseClient, supabaseUrl } from "../supabase/client";
import { BUCKETS, TABLES } from "./constants";

export async function applyToJob(token: string, _: unknown, jobData: Record<string, unknown>) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.user_id}`;

  const { error: storageError } = await supabase.storage.from(BUCKETS.resumes).upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}/storage/v1/object/public/${BUCKETS.resumes}/${fileName}`;

  const { data, error } = await supabase
    .from(TABLES.applications)
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

export async function updateApplicationStatus(token: string, { job_id }: { job_id: unknown }, status: unknown) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from(TABLES.applications).update({ status }).eq("job_id", job_id).select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token: string, { user_id }: { user_id: unknown }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from(TABLES.applications)
    .select(`*, job:${TABLES.jobs}(title, company:${TABLES.companies}(name))`)
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
