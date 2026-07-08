import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { Building2, MapPin, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { getCompanies } from "../api/apiCompanies";
import { getJobs } from "../api/apiJobs";
import JobCard from "../components/job-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import useFetch from "../hooks/useFetch";
import type { Company, Job } from "../types";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const { data: companies, fn: fnCompanies } = useFetch<Company[]>(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch<Job[]>(getJobs as any, {
    company_id,
    location,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) fnCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("search-query");
    if (query) setSearchQuery(String(query));
  };

  const hasActiveFilters = searchQuery || location || company_id;

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return (
      <BarLoader
        className="mb-4"
        width={"100%"}
        color="#36d7b7"
      />
    );
  }

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight pb-2">
          Latest Jobs
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Find your next opportunity from {jobs?.length ?? 0} active listings
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="space-y-2 mb-6"
      >
        <div className="flex gap-1.5">
          <div className="relative flex-[4] min-w-0">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Search jobs by title..."
              name="search-query"
              defaultValue={searchQuery}
              className="h-10 pl-9 pr-3 text-sm"
            />
          </div>
          <Button
            type="submit"
            className="h-10 px-3 gap-1.5 text-sm shrink-0 flex-1"
          >
            <Search size={15} />
            Search
          </Button>
        </div>

        <div className="flex gap-1.5">
          <div className="relative flex-1 min-w-0">
            <MapPin
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Select
              value={location}
              onValueChange={value => setLocation(value ?? "")}
            >
              <SelectTrigger className="h-10 pl-9 text-sm">
                <SelectValue
                  placeholder="Location"
                  className="truncate"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("MA").map(({ name }) => (
                    <SelectItem
                      key={name}
                      value={name}
                      className="truncate"
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1 min-w-0">
            <Building2
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Select
              value={company_id}
              onValueChange={value => setCompany_id(value ?? "")}
            >
              <SelectTrigger className="h-10 pl-9 text-sm">
                <SelectValue
                  placeholder="Company"
                  className="truncate"
                />
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
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-10 px-3 gap-1.5 text-sm text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
            >
              <X size={15} />
              Clear
            </Button>
          )}
        </div>
      </form>

      {loadingJobs && (
        <div className="mt-4">
          <BarLoader
            width={"100%"}
            color="#36d7b7"
          />
        </div>
      )}

      {loadingJobs === false && (
        <>
          {jobs?.length ? (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
              <Search
                size={40}
                strokeWidth={1}
              />
              <p className="text-lg font-medium">No jobs found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobListing;
