import { zodResolver } from "@hookform/resolvers/zod";
import { File, PenBox, Send, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import * as z from "zod";
import { applyToJob } from "../api/apiApplication";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useSupabaseUpload } from "../hooks/use-supabase-upload";
import useFetch from "../hooks/useFetch";
import { Dropzone, DropzoneEmptyState, formatBytes } from "./dropzone";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const schema = z.object({
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  experience: z.number().min(0, { message: "Experience must be at least 0" }).int(),
  skills: z.string().min(1, { message: "Skills are required" }),
});

interface ApplyJobDialogProps {
  user: { id: string; fullName?: string } | null;
  job: {
    id: number;
    title: string;
    isOpen: boolean;
    company?: { name: string };
  };
  fetchJob: () => void;
  applied?: boolean;
}

export function ApplyJobDialog({ user, job, fetchJob, applied = false }: ApplyJobDialogProps) {
  const [open, setOpen] = useState(false);

  const upload = useSupabaseUpload({
    allowedMimeTypes: ["application/pdf", "application/msword"],
    bucketName: "resumes",
    maxFiles: 1,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { education: "Intermediate", experience: 0 },
  });

  const { loading: loadingApply, error: errorApply, fn: fnApply } = useFetch(applyToJob as any, { method: "POST" });

  const errorMessage = errorApply
    ? typeof errorApply === "string"
      ? errorApply
      : (errorApply as { message?: string })?.message || "An error occurred"
    : null;

  const onSubmit = async (data: Record<string, unknown>) => {
    if (upload.files.length === 0) return;
    const result = await fnApply({
      ...data,
      user_id: user?.id,
      job_id: job.id,
      name: user?.fullName,
      resume: upload.files[0],
      status: "applied",
    });
    if (!result) return;
    fetchJob();
    reset();
    upload.setFiles([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!job?.isOpen || applied}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        <PenBox size={16} />
        {job?.isOpen ? (applied ? "Applied" : "Apply Now") : "Hiring Closed"}
      </DialogTrigger>
      <DialogContent>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <X size={16} />
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Apply for {job?.title}</DialogTitle>
          <DialogDescription>{job?.company?.name}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && <p className="text-xs text-destructive">{errors.experience.message as string}</p>}

          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && <p className="text-xs text-destructive">{errors.skills.message as string}</p>}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                {...field}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Intermediate"
                    id="intermediate"
                  />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Graduate"
                    id="graduate"
                  />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Post Graduate"
                    id="post-graduate"
                  />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && <p className="text-xs text-destructive">{errors.education.message as string}</p>}

          <div className="space-y-2">
            <label className="text-sm font-medium">Resume</label>
            <Dropzone
              className="w-full"
              {...upload}
            >
              <DropzoneEmptyState />
              {upload.files.length > 0 && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
                  <div className="flex items-center gap-2 truncate">
                    <File size={16} className="shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">{upload.files[0].name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatBytes(upload.files[0].size, 1)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => upload.setFiles([])}
                    className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </Dropzone>
          </div>

          {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}

          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button
            type="submit"
            size="lg"
            className="gap-2"
            disabled={loadingApply === true || upload.files.length === 0}
          >
            <Send size={16} />
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
