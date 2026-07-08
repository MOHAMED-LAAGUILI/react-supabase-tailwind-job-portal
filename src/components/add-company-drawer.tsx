import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
      fetchCompanies();
      reset();
      upload.setFiles([]);
      setOpen(false);
    }
  }, [loadingAddCompany]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className="inline-flex items-center justify-center shrink-0 h-10 w-10 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
        <Building2 size={16} />
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
                      src={upload.files[0].preview}
                      alt="Logo preview"
                      className="h-20 w-20 rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        upload.setFiles([]);
                      }}
                      className="absolute -top-2 -right-2 rounded-full bg-background border p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
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
              width={"100%"}
              color="#36d7b7"
            />
          )}
        </form>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={upload.files.length === 0}
            className="gap-2 flex-1"
          >
            <Upload size={15} />
            Add Company
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="gap-2"
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
