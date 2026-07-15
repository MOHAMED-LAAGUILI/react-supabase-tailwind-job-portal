import { useUser } from "@clerk/clerk-react";
import { Briefcase, Clock, Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { deleteJob, saveJob } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    description: string;
    location: string;
    country_code?: string;
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
    <Card className="group hover:shadow-md transition-shadow h-full">
      {loadingDeleteJob && (
        <BarLoader
          className="mt-4"
          width={"100%"}
          color="#36d7b7"
        />
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {job.company && (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="h-9 w-9 rounded-lg object-contain border bg-background shrink-0"
                onError={e => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Briefcase size={14} className="shrink-0" />
              <span className="truncate">{job.company?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </span>
            {isMyJob && (
              <Trash2Icon
                size={14}
                className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                onClick={handleDeleteJob}
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <h3 className="font-semibold text-base leading-snug mb-2">{job.title}</h3>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-1.5">
            <MapPinIcon size={14} />
            {job.country_code && (
              <img
                src={`https://flagcdn.com/w20/${job.country_code.toLowerCase()}.png`}
                alt=""
                className="h-3.5 w-5 object-cover rounded-sm"
              />
            )}
            {job.location}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {job.description.substring(0, job.description.indexOf("."))}.
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 py-1">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full text-xs">
            View Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            size="icon"
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
