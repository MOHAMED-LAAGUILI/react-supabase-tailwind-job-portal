import { supabaseClient } from "../utils/supabase";

// Fetch Jobs
export async function getJobs(
  token: string,
  { location, company_id, searchQuery }: { location: unknown; company_id: unknown; searchQuery: unknown }
) {
  const supabase = await supabaseClient(token);
  let query = supabase.from("jobs").select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Read Saved Jobs
export async function getSavedJobs(token: string) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// Read single job
export async function getSingleJob(token: string, { job_id }: { job_id: unknown }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url), applications: applications(*)")
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// - Add / Remove Saved Job
export async function saveJob(
  token: string,
  { alreadySaved }: { alreadySaved: unknown },
  saveData: { job_id: unknown; user_id?: string }
) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id)
      .eq("user_id", saveData.user_id)
      .select();

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([{ user_id: saveData.user_id, job_id: saveData.job_id }])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token: string, { job_id }: { job_id: unknown }, isOpen: unknown) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("jobs").update({ isOpen }).eq("id", job_id).select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token: string, { recruiter_id }: { recruiter_id: unknown }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token: string, { job_id }: { job_id: unknown }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase.from("jobs").delete().eq("id", job_id).select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

// - post job
export async function addNewJob(token: string, _: unknown, jobData: unknown) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("jobs").insert([jobData]).select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}
