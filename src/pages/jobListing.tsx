import { useUser } from "@clerk/clerk-react";
import { Country, State } from "country-state-city";
import { Building2, ChevronDown, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import { getCompanies } from "../api/apiCompanies";
import { getJobs } from "../api/apiJobs";
import JobCard from "../components/job-card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import useFetch from "../hooks/useFetch";
import type { Company, Job } from "../types";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const { isLoaded } = useUser();

  const countries = useMemo(() => Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name)), []);
  const regions = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []),
    [selectedCountry]
  );

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

  const hasActiveFilters = searchQuery || location || company_id || selectedCountry;

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setSelectedCountry("");
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

        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <CountryCombobox
              countries={countries}
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
              hideLabel
            />
          </div>

          <div className="flex-1 relative">
            <MapPin
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
            />
            <Select
              value={location}
              onValueChange={value => setLocation(value ?? "")}
              disabled={!selectedCountry}
            >
              <SelectTrigger className="h-10 pl-9 text-sm">
                <SelectValue
                  placeholder={selectedCountry ? "Region" : "Country first"}
                  className="truncate"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {regions.map(({ isoCode, name }) => (
                    <SelectItem
                      key={isoCode}
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

          <div className="flex-[1.5] relative">
            <Building2
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
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
                      key={id}
                      value={String(id)}
                      className="truncate"
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

function CountryCombobox({
  countries,
  selectedCountry,
  onSelect,
  hideLabel,
  height = "h-10",
}: {
  countries: { isoCode: string; name: string }[];
  selectedCountry: string;
  onSelect: (code: string) => void;
  hideLabel?: boolean;
  height?: string;
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
      {!hideLabel && <label className="text-sm font-medium">Country</label>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex ${height} w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-sm transition-colors hover:bg-accent cursor-pointer`}
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <img
                src={`https://flagcdn.com/w20/${selected.isoCode.toLowerCase()}.png`}
                alt=""
                className="h-4 w-5 object-cover rounded-sm shrink-0"
              />
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select country</span>
          )}
        </span>
        <ChevronDown size={14} className="text-muted-foreground shrink-0" />
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

export default JobListing;
