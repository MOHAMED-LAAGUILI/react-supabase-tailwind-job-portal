import { Boxes, BriefcaseBusiness, Download, MapPin, School } from "lucide-react";
import { BarLoader } from "react-spinners";
import { updateApplicationStatus } from "../api/apiApplication";
import useFetch from "../hooks/useFetch";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
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

  const statusColors: Record<string, string> = {
    applied: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    hired: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950",
    interviewing: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    rejected: "text-destructive bg-destructive/10",
  };

  return (
    <Card className="relative overflow-hidden">
      {loadingHiringStatus && (
        <BarLoader
          width={"100%"}
          color="#36d7b7"
        />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-base font-semibold leading-tight">
              {isCandidate ? `${application?.job?.title}` : application?.name}
            </span>
            {isCandidate && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground font-normal">
                <span>{application?.job?.company?.name}</span>
                <span className="text-muted-foreground/40">|</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {application?.job?.location}
                </span>
              </div>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleDownload}
          >
            <Download size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BriefcaseBusiness size={14} />
            {application?.experience} years exp.
          </span>
          <span className="flex items-center gap-1.5">
            <School size={14} />
            {application?.education}
          </span>
          <span className="flex items-center gap-1.5">
            <Boxes size={14} />
            {application?.skills}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <span className="text-xs text-muted-foreground">{new Date(application?.created_at).toLocaleDateString()}</span>
        {isCandidate ? (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[application.status] || "bg-muted text-muted-foreground"}`}
          >
            {application.status}
          </span>
        ) : (
          <Select
            onValueChange={value => handleStatusChange(value ?? "")}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-40 h-8 text-xs">
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
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
