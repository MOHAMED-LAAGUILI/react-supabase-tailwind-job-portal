import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { getApplications } from "../api/apiApplication";
import useFetch from "../hooks/useFetch";
import ApplicationCard from "./application-card";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user?.id ?? "",
  });

  useEffect(() => {
    fnApplications();
  }, [fnApplications]);

  if (!user) return null;

  if (loadingApplications) {
    return (
      <BarLoader
        className="mb-4"
        color="#36d7b7"
        width={"100%"}
      />
    );
  }

  return (
    <>
      {applications?.length ? (
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {applications?.map(application => (
            <ApplicationCard
              application={application}
              isCandidate={true}
              key={application.id}
            />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-4 text-muted-foreground">
          <div className="rounded-full bg-muted/50 p-4 ring-1 ring-foreground/5">
            <Send
              size={36}
              strokeWidth={1.2}
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold tracking-tight">No applications yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Applications you submit will show up here</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatedApplications;
