import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, Building2, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { getSingleJob, updateHiringStatus } from "../api/apiJobs";
import ApplicationCard from "../components/application-card";
import { ApplyJobDrawer } from "../components/apply-job";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import useFetch from "../hooks/useFetch";
import type { Job } from "../types";

const JobPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch<Job>(getSingleJob as any, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(updateHiringStatus as any, {
    job_id: id,
  });

  const handleStatusChange = (value: string | null) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return (
      <BarLoader
        className="mb-4"
        width={"100%"}
        color="#36d7b7"
      />
    );
  }

  const isRecruiter = job?.recruiter_id === user?.id;
  const hasApplied = job?.applications?.find(ap => ap.candidate_id === user?.id);

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg border bg-card flex items-center justify-center overflow-hidden shrink-0">
            {job?.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt=""
                className="h-10 w-10 object-cover"
              />
            ) : (
              <Building2
                size={20}
                className="text-muted-foreground"
              />
            )}
          </div>
          <div>
            <h1 className="gradient-title font-extrabold text-3xl sm:text-5xl leading-tight">{job?.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{job?.company?.name}</p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm bg-muted rounded-full px-3 py-1.5">
          <MapPinIcon
            size={14}
            className="text-muted-foreground"
          />
          {job?.location}
        </div>
        <div className="flex items-center gap-1.5 text-sm bg-muted rounded-full px-3 py-1.5">
          <Briefcase
            size={14}
            className="text-muted-foreground"
          />
          {job?.applications?.length ?? 0} Applicant{(job?.applications?.length ?? 0) !== 1 ? "s" : ""}
        </div>
        <div
          className={`flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 ${
            job?.isOpen
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {job?.isOpen ? <DoorOpen size={14} /> : <DoorClosed size={14} />}
          {job?.isOpen ? "Open" : "Closed"}
        </div>
      </div>

      {/* Hiring Status (recruiter only) */}
      {isRecruiter && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Hiring Status:</span>
          <Select
            onValueChange={handleStatusChange}
            defaultValue={job?.isOpen ? "open" : "closed"}
          >
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          {loadingHiringStatus && (
            <BarLoader
              width={"100%"}
              color="#36d7b7"
            />
          )}
        </div>
      )}

      {/* About the job */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">About the job</h2>
        <p className="text-muted-foreground sm:text-base leading-relaxed">{job?.description}</p>
      </section>

      {/* Requirements */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">What we are looking for</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
          <MDEditor.Markdown
            source={job?.requirements}
            className="bg-transparent"
          />
        </div>
      </section>

      {/* Apply or Applied button */}
      {!isRecruiter && (
        <div className="flex justify-center sm:justify-start">
          <ApplyJobDrawer
            job={job as any}
            user={user as any}
            fetchJob={fnJob}
            applied={hasApplied as any}
          />
        </div>
      )}

      {/* Applications (recruiter only) */}
      {isRecruiter && job?.applications && job.applications.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Applications ({job.applications.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {job.applications.map(application => (
              <ApplicationCard
                key={application.id}
                application={application as any}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default JobPage;
