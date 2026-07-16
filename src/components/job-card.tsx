import { useUser } from "@clerk/clerk-react";
import { BookmarkCheck, Clock, Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { deleteJob, saveJob } from "../api/apiJobs";
import useFetch from "../hooks/useFetch";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface JobCardProps {
  isMyJob?: boolean;
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
  onJobAction?: () => void;
  savedInit?: boolean;
}

const JobCard = ({ job, savedInit = false, onJobAction = () => {}, isMyJob = false }: JobCardProps) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const { loading: loadingSavedJob, fn: fnSavedJob } = useFetch(saveJob as any);

  const handleSaveJob = async () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    toast(nextSaved ? "Job saved successfully" : "Job removed from saved", {
      icon: nextSaved ? "❤️" : "💔",
    });
    await fnSavedJob({
      alreadySaved: saved,
      job_id: job.id,
      user_id: user?.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  const daysAgo = useSyncExternalStore(
    onStoreChange => {
      const id = setInterval(onStoreChange, 60000);
      return () => clearInterval(id);
    },
    () => Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <Card className="group hover:ring-2 hover:ring-primary/20 transition-all duration-300 h-full">
      {loadingDeleteJob && (
        <BarLoader
          className="mt-4"
          color="#36d7b7"
          width={"100%"}
        />
      )}

      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {job.company && (
              <div className="h-12 w-12 shrink-0 rounded-xl bg-muted/50 ring-1 ring-foreground/5 flex items-center justify-center overflow-hidden">
                <img
                  alt={job.company.name}
                  className="h-8 w-8 object-contain"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  src={job.company.logo_url}
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                {job.company?.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mt-0.5">
                <Clock size={11} />
                <span>{daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {savedInit && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary tracking-wide">
                <BookmarkCheck size={10} />
                Saved
              </span>
            )}
            {isMyJob && (
              <button
                aria-label="Delete job"
                className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                onClick={handleDeleteJob}
                type="button"
              >
                <Trash2Icon size={14} />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-1">
        <h3 className="font-semibold text-lg leading-snug mb-3">{job.title}</h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon
            size={14}
            className="shrink-0"
          />
          {job.country_code && (
            <img
              alt=""
              className="h-3.5 w-5 object-cover rounded-sm shrink-0"
              src={`https://flagcdn.com/w20/${job.country_code.toLowerCase()}.png`}
            />
          )}
          <span className="truncate">{job.location}</span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
          {job.description.substring(0, job.description.indexOf("."))}.
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 py-2">
        <Link
          className="flex-1"
          to={`/job/${job.id}`}
        >
          <Button
            className="w-full text-xs"
            size="sm"
            variant="default"
          >
            View Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            disabled={!!loadingSavedJob}
            onClick={handleSaveJob}
            size="icon"
            variant={saved ? "default" : "outline"}
            className={saved ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {saved ? (
              <Heart
                fill="currentColor"
                size={16}
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
