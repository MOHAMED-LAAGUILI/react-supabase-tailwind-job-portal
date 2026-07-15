import { zodResolver } from "@hookform/resolvers/zod";
import { PenBox, Send, X } from "lucide-react";
import { useRef, useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import useFetch from "../hooks/useFetch";
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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

  const onSubmit = (data: Record<string, unknown>) => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setFileError("Resume is required");
      return;
    }
    const validTypes = ["application/pdf", "application/msword"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only PDF or Word documents are allowed");
      return;
    }
    setFileError(null);
    fnApply({
      ...data,
      user_id: user?.id,
      job_id: job.id,
      name: user?.fullName,
      resume: file,
      status: "applied",
    }).then(() => {
      fetchJob();
      reset();
      setOpen(false);
    });
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

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          />
          {fileError && <p className="text-xs text-destructive">{fileError}</p>}

          {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}

          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button
            type="submit"
            size="lg"
            className="gap-2"
            disabled={loadingApply === true}
          >
            <Send size={16} />
            Submit Application
          </Button>
        </form>

        <DialogFooter>
          <DialogClose className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent transition-colors cursor-pointer">
            <X size={15} />
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
