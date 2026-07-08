import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { Building2, MapPin, Send } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { getCompanies } from "../api/apiCompanies";
import { addNewJob } from "../api/apiJobs";
import AddCompanyDrawer from "../components/add-company-drawer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import useFetch from "../hooks/useFetch";
import type { Company } from "../types";

const schema = z.object({
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
  title: z.string().min(1, { message: "Title is required" }),
});

type FormData = z.infer<typeof schema>;

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { company_id: "", location: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data: FormData) => {
    if (!user) return;
    fnCreateJob({
      ...data,
      company_id: Number(data.company_id),
      isOpen: true,
      recruiter_id: user.id,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length) navigate("/jobs");
  }, [loadingCreateJob]);

  const { loading: loadingCompanies, data: companies, fn: fnCompanies } = useFetch<Company[]>(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return (
      <BarLoader
        className="mb-4"
        width={"100%"}
        color="#36d7b7"
      />
    );
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="py-6">
      <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl text-center pb-8">Post a Job</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto space-y-5"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Title</label>
          <Input
            placeholder="e.g. Senior Frontend Developer"
            {...register("title")}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Description</label>
          <Textarea
            placeholder="Describe the role, responsibilities, and ideal candidate..."
            className="min-h-28"
            {...register("description")}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <MapPin
                      size={15}
                      className="text-muted-foreground shrink-0"
                    />
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {State.getStatesOfCountry("MA").map(({ name }) => (
                        <SelectItem
                          key={name}
                          value={name}
                        >
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <div className="flex gap-2">
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="flex-1">
                      <Building2
                        size={8}
                        className="text-muted-foreground"
                      />
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies?.map(({ name, id }) => (
                          <SelectItem
                            key={name}
                            value={String(id)}
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <AddCompanyDrawer fetchCompanies={fnCompanies} />
            </div>
            {errors.company_id && <p className="text-xs text-destructive">{errors.company_id.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Requirements</label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <MDEditor
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.requirements && <p className="text-xs text-destructive">{errors.requirements.message}</p>}
        </div>

        {errorCreateJob?.message && <p className="text-sm text-destructive">{errorCreateJob.message}</p>}

        {loadingCreateJob && (
          <BarLoader
            width={"100%"}
            color="#36d7b7"
          />
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full gap-2"
        >
          <Send size={16} />
          Submit Job Listing
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
