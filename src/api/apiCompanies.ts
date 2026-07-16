import { supabaseClient, supabaseUrl } from "../supabase/client";
import { BUCKETS, TABLES } from "./constants";

export async function getCompanies(token: string) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase.from(TABLES.companies).select("*");

  if (error) {
    console.error(`Error fetching ${TABLES.companies}: `, error);
    return null;
  }

  return data;
}

export async function addNewCompany(
  token: string,
  _: unknown,
  companyData: {
    name: string;
    logo: File;
  }
) {
  const supabase = supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage.from(BUCKETS.companyLogo).upload(fileName, companyData.logo);

  if (storageError) {
    console.error(storageError);
    throw new Error("Error uploading company logo.");
  }

  const logoUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKETS.companyLogo}/${fileName}`;

  const { data, error } = await supabase
    .from(TABLES.companies)
    .insert({
      logo_url: logoUrl,
      name: companyData.name,
    })
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating company.");
  }

  return data;
}
