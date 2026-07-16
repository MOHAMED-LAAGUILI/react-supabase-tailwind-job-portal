import { useUser } from "@clerk/clerk-react";
import { Briefcase } from "lucide-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { getMyJobs } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import JobCard from "./job-card";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user?.id ?? "",
  });

  useEffect(() => {
    fnCreatedJobs();
  }, [fnCreatedJobs]);

  if (!user) return null;

  if (loadingCreatedJobs) {
    return (
      <BarLoader
        className="mt-4"
        color="#36d7b7"
        width={"100%"}
      />
    );
  }

  return (
    <>
      {createdJobs?.length ? (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {createdJobs.map(job => (
            <JobCard
              isMyJob
              job={job}
              key={job.id}
              onJobAction={fnCreatedJobs}
            />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-4 text-muted-foreground">
          <div className="rounded-full bg-muted/50 p-4 ring-1 ring-foreground/5">
            <Briefcase
              size={36}
              strokeWidth={1.2}
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold tracking-tight">No jobs posted yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Create your first job listing to start receiving applications
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatedJobs;
