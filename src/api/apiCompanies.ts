import { supabaseClient, supabaseUrl } from "../utils/supabase";

// Fetch Companies
export async function getCompanies(token: string) {
  const supabase = supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching companies:", error);
    return null;
  }

  return data;
}

// Add Company
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

  const { error: storageError } = await supabase.storage.from("company-logo").upload(fileName, companyData.logo);

  if (storageError) {
    console.error(storageError);
    throw new Error("Error uploading company logo.");
  }

  const logoUrl = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
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
