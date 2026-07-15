import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { getApplications } from "../api/apiApplication";
import useFetch from "../hooks/useFetch";
import ApplicationCard from "./application-card";

const CreatedApplications = () => {
  const { user } = useUser();

  if (!user) return null;

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, []);

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
        <div className="mt-20 flex flex-col items-center gap-3 text-muted-foreground">
          <Send
            size={40}
            strokeWidth={1}
          />
          <p className="text-lg font-medium">No applications yet</p>
          <p className="text-sm">Applications you submit will show up here</p>
        </div>
      )}
    </>
  );
};

export default CreatedApplications;
