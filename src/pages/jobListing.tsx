import { useUser } from "@clerk/clerk-react";
import { Country, State } from "country-state-city";
import { Building2, ChevronDown, MapPin, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
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

  const countries = Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name));
  const regions = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];

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

  const selectedCompany = companies?.find(co => String(co.id) === company_id);

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
        color="#36d7b7"
        width={"100%"}
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
        className="space-y-2 mb-6"
        onSubmit={handleSearch}
      >
        <div className="flex gap-1.5">
          <div className="relative flex-4 min-w-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              size={15}
            />
            <Input
              className="h-10 pl-9 pr-3 text-sm"
              defaultValue={searchQuery}
              name="search-query"
              placeholder="Search jobs by title..."
              type="text"
            />
          </div>
          <Button
            className="h-10 px-3 gap-1.5 text-sm shrink-0 flex-1"
            type="submit"
          >
            <Search size={15} />
            Search
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] gap-3">
          <CountryCombobox
            countries={countries}
            hideLabel
            onSelect={setSelectedCountry}
            selectedCountry={selectedCountry}
          />

          <Select
            disabled={!selectedCountry}
            onValueChange={value => setLocation(value ?? "")}
            value={location}
          >
            <SelectTrigger className="data-[size=default]:h-10 h-10 w-full">
              <MapPin className="size-4 text-muted-foreground" />
              <SelectValue placeholder={selectedCountry ? "Region" : "Country first"} />
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

          <Select
            onValueChange={value => setCompany_id(value ?? "")}
            value={company_id}
          >
            <SelectTrigger className="data-[size=default]:h-10 h-10 w-full">
              <Building2
                className="text-muted-foreground shrink-0"
                size={15}
              />
              <span className="flex-1 text-left truncate">
                {selectedCompany ? (
                  `${selectedCompany.id} - ${selectedCompany.name}`
                ) : (
                  <span className="text-muted-foreground">Select company</span>
                )}
              </span>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {companies?.map(({ id, name }) => (
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

          {hasActiveFilters && (
            <Button
              className="h-10 w-full sm:w-auto whitespace-nowrap"
              onClick={clearFilters}
              variant="outline"
            >
              <X className="size-4" />
              Clear
            </Button>
          )}
        </div>
      </form>

      {loadingJobs && (
        <div className="mt-4">
          <BarLoader
            color="#36d7b7"
            width={"100%"}
          />
        </div>
      )}

      {loadingJobs === false && (
        <>
          {jobs?.length ? (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map(job => (
                <JobCard
                  job={job}
                  key={job.id}
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
                  className="mt-2"
                  onClick={clearFilters}
                  variant="outline"
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

  const filtered = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const selected = selectedCountry ? countries.find(c => c.isoCode === selectedCountry) : null;

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <label
          className="text-sm font-medium"
          htmlFor="country-filter"
        >
          Country
        </label>
      )}
      <button
        className={`flex ${height} w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-sm transition-colors hover:bg-accent cursor-pointer`}
        id="country-filter"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <img
                alt=""
                className="h-4 w-5 object-cover rounded-sm shrink-0"
                src={`https://flagcdn.com/w20/${selected.isoCode.toLowerCase()}.png`}
              />
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select country</span>
          )}
        </span>
        <ChevronDown
          className="text-muted-foreground shrink-0"
          size={14}
        />
      </button>

      <Dialog
        onOpenChange={v => {
          setOpen(v);
          if (!v) setSearch("");
        }}
        open={open}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Country</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <Input
              autoFocus
              className="pl-8"
              onChange={e => setSearch(e.target.value)}
              placeholder="Search countries..."
              value={search}
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-0.5 -mx-1">
            {filtered.map(({ isoCode, name }) => (
              <button
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left transition-colors cursor-pointer ${
                  selectedCountry === isoCode ? "bg-accent font-medium" : "hover:bg-accent"
                }`}
                key={isoCode}
                onClick={() => {
                  onSelect(isoCode);
                  setOpen(false);
                  setSearch("");
                }}
                type="button"
              >
                <img
                  alt=""
                  className="h-4 w-5 object-cover rounded-sm shrink-0"
                  src={`https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`}
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
