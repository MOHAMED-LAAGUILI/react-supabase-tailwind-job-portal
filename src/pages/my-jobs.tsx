import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import CreatedApplications from "../components/created-applications";
import CreatedJobs from "../components/created-jobs";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <BarLoader
        className="mb-4"
        color="#36d7b7"
        width={"100%"}
      />
    );
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight pb-2">
          {isCandidate ? "My Applications" : "My Jobs"}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {isCandidate
            ? "Track your job applications and their status"
            : "Manage your job listings and review applicants"}
        </p>
      </div>

      {isCandidate ? <CreatedApplications /> : <CreatedJobs />}
    </div>
  );
};

export default MyJobs;
