import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { addNewCompany } from "../api/apiCompanies";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useSupabaseUpload } from "../hooks/use-supabase-upload";
import useFetch from "../hooks/useFetch";
import { Dropzone, DropzoneEmptyState } from "./dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
});

type FormData = z.infer<typeof schema>;

const AddCompanyDrawer = ({ fetchCompanies }: { fetchCompanies: () => void }) => {
  const [open, setOpen] = useState(false);

  const upload = useSupabaseUpload({
    allowedMimeTypes: ["image/png", "image/jpeg"],
    bucketName: "company-logo",
    maxFiles: 1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany as any, { method: "POST" });

  const onSubmit = async (data: FormData) => {
    if (upload.files.length === 0) return;
    fnAddCompany({ ...data, logo: upload.files[0] });
  };

  useEffect(() => {
    if (Array.isArray(dataAddCompany) && dataAddCompany.length > 0) {
      toast.success("Company created successfully");
      fetchCompanies();
      reset();
      upload.setFiles([]);
      setOpen(false);
    }
  }, [loadingAddCompany]);

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger className="inline-flex items-center justify-center shrink-0 h-8 w-8 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
        <Plus size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Company</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              placeholder="e.g. Acme Corp"
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Logo</label>
            <Dropzone
              className="w-full"
              {...upload}
            >
              <DropzoneEmptyState />
              {upload.files.length > 0 && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="relative inline-flex">
                    <img
                      alt="Logo preview"
                      className="h-20 w-20 rounded-lg border object-cover"
                      src={upload.files[0].preview}
                    />
                    <button
                      className="absolute -top-2 -right-2 rounded-full bg-background border p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        upload.setFiles([]);
                      }}
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </Dropzone>
          </div>

          {(errorAddCompany as { message?: string } | null)?.message && (
            <p className="text-sm text-destructive">{(errorAddCompany as { message: string }).message}</p>
          )}

          {loadingAddCompany && (
            <BarLoader
              color="#36d7b7"
              width={"100%"}
            />
          )}
        </form>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            className="gap-2 flex-1"
            disabled={upload.files.length === 0}
            onClick={handleSubmit(onSubmit)}
            type="button"
          >
            <Upload size={15} />
            Add Company
          </Button>
          <Button
            className="gap-2"
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
          >
            <X size={15} />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDrawer;
