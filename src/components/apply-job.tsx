import { zodResolver } from "@hookform/resolvers/zod";
import { PenBox, Send, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import * as z from "zod";
import { applyToJob } from "../api/apiApplication";
import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import useFetch from "../hooks/useFetch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const schema = z.object({
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  experience: z.number().min(0, { message: "Experience must be at least 0" }).int(),
  resume: z
    .any()
    .refine(file => file[0] && (file[0].type === "application/pdf" || file[0].type === "application/msword"), {
      message: "Only PDF or Word documents are allowed",
    }),
  skills: z.string().min(1, { message: "Skills are required" }),
});

interface ApplyJobDrawerProps {
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

export function ApplyJobDrawer({ user, job, fetchJob, applied = false }: ApplyJobDrawerProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { loading: loadingApply, error: errorApply, fn: fnApply } = useFetch(applyToJob as any, { method: "POST" });

  const errorMessage = errorApply
    ? typeof errorApply === "string"
      ? errorApply
      : (errorApply as { message?: string })?.message || "An error occurred"
    : null;

  const onSubmit = (data: Record<string, unknown>) => {
    fnApply({
      ...data,
      candidate_id: user?.id,
      job_id: job.id,
      name: user?.fullName,
      resume: (data.resume as File[])[0],
      status: "applied",
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer>
      <DrawerTrigger className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
        <PenBox size={16} />
        {job?.isOpen ? (applied ? "Applied" : "Apply Now") : "Hiring Closed"}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Apply for {job?.title}</DrawerTitle>
          <DrawerDescription>{job?.company?.name}</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
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

          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium"
            {...register("resume")}
          />
          {errors.resume && <p className="text-xs text-destructive">{errors.resume.message as string}</p>}

          {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}

          {loadingApply && (
            <BarLoader
              width={"100%"}
              color="#36d7b7"
            />
          )}

          <Button
            type="submit"
            size="lg"
            className="gap-2"
          >
            <Send size={16} />
            Submit Application
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent transition-colors cursor-pointer">
            <X size={15} />
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
