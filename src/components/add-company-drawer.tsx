import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { addNewCompany } from "../api/apiCompanies";
import { Building2, Upload, X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only PNG and JPEG images are allowed" }
    ),
});

type FormData = z.infer<typeof schema>;

const AddCompanyDrawer = ({ fetchCompanies }: { fetchCompanies: () => void }) => {
  const [open, setOpen] = useState(false);

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
  } = useFetch(addNewCompany);

  const onSubmit = async (data: FormData) => {
    fnAddCompany({ ...data, logo: data.logo[0] });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
      reset();
      setOpen(false);
    }
  }, [loadingAddCompany]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button type="button" variant="outline" size="icon" className="shrink-0">
          <Building2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Company</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input placeholder="e.g. Acme Corp" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Logo</label>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              className="file:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium"
              {...register("logo")}
            />
            {errors.logo && (
              <p className="text-xs text-destructive">{errors.logo.message}</p>
            )}
          </div>

          {errorAddCompany?.message && (
            <p className="text-sm text-destructive">{errorAddCompany.message}</p>
          )}

          {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
        </form>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
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
