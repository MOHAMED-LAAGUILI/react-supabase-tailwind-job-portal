import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, State } from "country-state-city";
import { Building2, ChevronDown, MapPin, Search, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { getCompanies } from "../api/apiCompanies";
import { addNewJob } from "../api/apiJobs";
import AddCompanyDrawer from "../components/add-company-drawer";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
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

  const [selectedCountry, setSelectedCountry] = useState("");

  const countries = useMemo(() => Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name)), []);
  const regions = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []),
    [selectedCountry]
  );

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

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:min-w-0 flex-1">
            <CountryCombobox
              countries={countries}
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />
          </div>

          <div className="w-full sm:min-w-0 flex-1 space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger>
                    <MapPin
                      size={15}
                      className="text-muted-foreground shrink-0"
                    />
                    <SelectValue placeholder={selectedCountry ? "Select region" : "Select a country first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {regions.map(({ isoCode, name }) => (
                        <SelectItem
                          key={isoCode}
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

          <div className="w-full sm:min-w-0 flex-[1.5] space-y-2">
            <label className="text-sm font-medium">Company</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => {
                    const selectedCompany = companies?.find(co => String(co.id) === field.value);
                    return (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <Building2
                            size={15}
                            className="text-muted-foreground shrink-0"
                          />
                          <span className="flex-1 text-left truncate">
                            {selectedCompany ? `${selectedCompany.id} - ${selectedCompany.name}` : <span className="text-muted-foreground">Select company</span>}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {companies?.map(({ name, id }) => (
                              <SelectItem
                                key={id}
                                value={String(id)}
                              >
                                {id} - {name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
              <AddCompanyDrawer fetchCompanies={fnCompanies} />
            </div>
            {errors.company_id && <p className="text-xs text-destructive">{errors.company_id.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Requirements</label>
          <Textarea
            placeholder="List the requirements, qualifications, and any other relevant details..."
            className="min-h-32"
            {...register("requirements")}
          />
          {errors.requirements && <p className="text-xs text-destructive">{errors.requirements.message}</p>}
        </div>

        {(errorCreateJob as { message?: string } | null)?.message && (
          <p className="text-sm text-destructive">{(errorCreateJob as { message: string }).message}</p>
        )}

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

function CountryCombobox({
  countries,
  selectedCountry,
  onSelect,
}: {
  countries: { isoCode: string; name: string }[];
  selectedCountry: string;
  onSelect: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [countries, search]
  );

  const selected = selectedCountry ? countries.find(c => c.isoCode === selectedCountry) : null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Country</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors hover:bg-accent cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <img
                src={`https://flagcdn.com/w20/${selected.isoCode.toLowerCase()}.png`}
                alt=""
                className="h-4 w-5 object-cover rounded-sm"
              />
              {selected.name}
            </>
          ) : (
            <span className="text-muted-foreground">Select country</span>
          )}
        </span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>

      <Dialog
        open={open}
        onOpenChange={v => {
          setOpen(v);
          if (!v) setSearch("");
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Country</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="pl-8"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-0.5 -mx-1">
            {filtered.map(({ isoCode, name }) => (
              <button
                key={isoCode}
                type="button"
                onClick={() => {
                  onSelect(isoCode);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left transition-colors cursor-pointer ${
                  selectedCountry === isoCode ? "bg-accent font-medium" : "hover:bg-accent"
                }`}
              >
                <img
                  src={`https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`}
                  alt=""
                  className="h-4 w-5 object-cover rounded-sm shrink-0"
                />
                {name}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-4 text-sm text-muted-foreground text-center">No countries found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PostJob;
