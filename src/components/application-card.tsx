import { BriefcaseBusiness, Calendar, Download, ExternalLink, MapPin, School } from "lucide-react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { updateApplicationStatus } from "../api/apiApplication";
import useFetch from "../hooks/useFetch";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ApplicationCardProps {
  application: {
    id: number;
    name: string;
    experience: string;
    education: string;
    skills: string;
    resume: string;
    status: string;
    created_at: string;
    job_id: number;
    job?: {
      title: string;
      location: string;
      company?: { name: string; logo_url: string };
    };
  };
  isCandidate?: boolean;
}

const statusMeta: Record<string, { label: string; className: string }> = {
  applied: {
    className: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    label: "Applied",
  },
  hired: {
    className: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950",
    label: "Hired",
  },
  interviewing: {
    className: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    label: "Interviewing",
  },
  rejected: {
    className: "text-destructive bg-destructive/10",
    label: "Rejected",
  },
};

const ApplicationCard = ({ application, isCandidate = false }: ApplicationCardProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(updateApplicationStatus, {
    job_id: application.job_id,
  });

  const handleStatusChange = (status: string) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  const status = statusMeta[application.status] || {
    className: "bg-muted text-muted-foreground",
    label: application.status,
  };

  const companyLogo = application?.job?.company?.logo_url;

  return (
    <Card className="relative overflow-hidden group hover:ring-2 hover:ring-primary/20 transition-all duration-300 h-full">
      {loadingHiringStatus && (
        <BarLoader
          className="absolute top-0 left-0 w-full"
          color="#36d7b7"
          width={"100%"}
        />
      )}
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {companyLogo && (
              <div className="h-12 w-12 shrink-0 rounded-xl bg-muted/50 ring-1 ring-foreground/5 flex items-center justify-center overflow-hidden">
                <img
                  alt={application.job!.company!.name}
                  className="h-8 w-8 object-contain"
                  src={companyLogo}
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-base font-semibold leading-tight block truncate">
                {isCandidate ? application?.job?.title : application?.name}
              </span>
              {application?.job?.company?.name && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="truncate">{application.job.company.name}</span>
                  {application?.job?.location && (
                    <>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin size={10} />
                        {application.job.location}
                      </span>
                    </>
                  )}
                </div>
              )}
              {!isCandidate && (
                <span className="text-xs text-muted-foreground/70 mt-0.5">{application?.experience} years exp.</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isCandidate && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize tracking-wide ${status.className}`}
              >
                {status.label}
              </span>
            )}
            <Button
              className="shrink-0 h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={handleDownload}
              size="icon"
              variant="ghost"
              title="Download resume"
            >
              <Download size={15} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {isCandidate && application?.experience && (
            <span className="flex items-center gap-1.5">
              <BriefcaseBusiness
                size={14}
                className="shrink-0"
              />
              {application.experience} years exp.
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <School
              size={14}
              className="shrink-0"
            />
            {application?.education}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {application?.skills?.split(",").map((skill) => (
            <span
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              key={skill.trim()}
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between py-2 gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70 shrink-0">
          <Calendar size={11} />
          {new Date(application?.created_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <div className="flex items-center gap-2">
          {!isCandidate && (
            <Select
              defaultValue={application.status}
              onValueChange={value => handleStatusChange(value ?? "")}
            >
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
          {isCandidate && application?.job_id && (
            <Link to={`/job/${application.job_id}`}>
              <Button
                className="text-xs gap-1.5"
                size="sm"
                variant="outline"
              >
                View Job
                <ExternalLink size={12} />
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
