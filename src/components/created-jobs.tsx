import { useUser } from "@clerk/clerk-react";
import { Briefcase } from "lucide-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { getMyJobs } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import JobCard from "./job-card";

const CreatedJobs = () => {
  const { user } = useUser();

  if (!user) return null;

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  if (loadingCreatedJobs) {
    return (
      <BarLoader
        className="mt-4"
        width={"100%"}
        color="#36d7b7"
      />
    );
  }

  return (
    <>
      {createdJobs?.length ? (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {createdJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onJobAction={fnCreatedJobs}
              isMyJob
            />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <Briefcase
            size={40}
            strokeWidth={1}
          />
          <p className="text-lg font-medium">No jobs posted yet</p>
          <p className="text-sm">Create your first job listing to start receiving applications</p>
        </div>
      )}
    </>
  );
};

export default CreatedJobs;
