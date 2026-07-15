import { useUser } from "@clerk/clerk-react";
import { Bookmark } from "lucide-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { getSavedJobs } from "../api/apiJobs";
import JobCard from "../components/job-card";
import useFetch from "../hooks/useFetch";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const { loading: loadingSavedJobs, data: savedJobs, fn: fnSavedJobs } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

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
          Saved Jobs
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {savedJobs?.length
            ? `${savedJobs.length} saved job${savedJobs.length > 1 ? "s" : ""} to review`
            : "Jobs you save will appear here"}
        </p>
      </div>

      {loadingSavedJobs && (
        <BarLoader
          color="#36d7b7"
          width={"100%"}
        />
      )}

      {loadingSavedJobs === false && (
        <>
          {savedJobs?.length ? (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedJobs?.map(saved => (
                <JobCard
                  job={saved?.job}
                  key={saved.id}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
              <Bookmark
                size={40}
                strokeWidth={1}
              />
              <p className="text-lg font-medium">No saved jobs yet</p>
              <p className="text-sm">Save jobs you're interested in to find them later</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedJobs;
