import { useUser } from "@clerk/clerk-react";
import { Briefcase, Clock, Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { deleteJob, saveJob } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    description: string;
    location: string;
    company: { name: string; logo_url: string };
    saved: { id: number }[];
    created_at: string;
  };
  savedInit?: boolean;
  onJobAction?: () => void;
  isMyJob?: boolean;
}

const JobCard = ({ job, savedInit = false, onJobAction = () => {}, isMyJob = false }: JobCardProps) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob as any, {
    job_id: job.id,
    user_id: user?.id,
  });

  const handleSaveJob = async () => {
    await fnSavedJob({
      job_id: job.id,
      user_id: user?.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(Array.isArray(savedJob) && savedJob.length > 0);
  }, [savedJob]);

  const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="flex flex-col group hover:shadow-md transition-shadow">
      {loadingDeleteJob && (
        <BarLoader
          className="mt-4"
          width={"100%"}
          color="#36d7b7"
        />
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {job.company && (
            <img
              src={job.company.logo_url}
              alt={job.company.name}
              className="h-10 w-10 rounded-lg object-contain border bg-background shrink-0"
              onError={e => {
                (e.target as HTMLImageElement).src = "";
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <CardTitle className="font-semibold text-base leading-snug flex-1">{job.title}</CardTitle>
          {isMyJob && (
            <Trash2Icon
              size={16}
              className="text-muted-foreground hover:text-destructive cursor-pointer shrink-0 mt-1 transition-colors"
              onClick={handleDeleteJob}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1 pb-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPinIcon size={14} />
            {job.location}
          </span>
          {job.company && (
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} />
              {job.company.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {job.description.substring(0, job.description.indexOf("."))}.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Link
          to={`/job/${job.id}`}
          className="flex-1"
        >
          <Button
            variant="default"
            size="sm"
            className="w-full text-xs"
          >
            View Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleSaveJob}
            disabled={!!loadingSavedJob}
          >
            {saved ? (
              <Heart
                size={16}
                fill="hsl(var(--destructive))"
                stroke="hsl(var(--destructive))"
              />
            ) : (
              <Heart size={16} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
