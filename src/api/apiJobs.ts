import { supabaseClient } from "../supabase/client";
import { TABLES } from "./constants";

export async function getJobs(
  token: string,
  { location, company_id, searchQuery }: { location: unknown; company_id: unknown; searchQuery: unknown }
) {
  const supabase = supabaseClient(token);
  let query = supabase
    .from(TABLES.jobs)
    .select(`*, saved: ${TABLES.savedJobs}(id), company: ${TABLES.companies}(name,logo_url)`);

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

export async function getSavedJobs(token: string) {
  const supabase = supabaseClient(token);
  const { data, error } = await supabase
    .from(TABLES.savedJobs)
    .select(`*, job: ${TABLES.jobs}(*, company: ${TABLES.companies}(name,logo_url))`);

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

export async function getSingleJob(token: string, { job_id }: { job_id: unknown }) {
  const supabase = supabaseClient(token);
  let query = supabase
    .from(TABLES.jobs)
    .select(`*, company: ${TABLES.companies}(name,logo_url), applications: ${TABLES.applications}(*)`)
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

export async function saveJob(
  token: string,
  _options: unknown,
  saveData: { alreadySaved: boolean; job_id: unknown; user_id?: string }
) {
  const supabase = supabaseClient(token);

  if (saveData.alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from(TABLES.savedJobs)
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
      .from(TABLES.savedJobs)
      .insert([{ job_id: saveData.job_id, user_id: saveData.user_id }])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

export async function updateHiringStatus(token: string, { job_id }: { job_id: unknown }, isOpen: unknown) {
  const supabase = supabaseClient(token);
  const { data, error } = await supabase.from(TABLES.jobs).update({ isOpen }).eq("id", job_id).select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token: string, { recruiter_id }: { recruiter_id: unknown }) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase
    .from(TABLES.jobs)
    .select(`*, company: ${TABLES.companies}(name,logo_url)`)
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function deleteJob(token: string, { job_id }: { job_id: unknown }) {
  const supabase = supabaseClient(token);

  const { data, error: deleteError } = await supabase.from(TABLES.jobs).delete().eq("id", job_id).select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

export async function addNewJob(token: string, _: unknown, jobData: unknown) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase.from(TABLES.jobs).insert([jobData]).select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}
