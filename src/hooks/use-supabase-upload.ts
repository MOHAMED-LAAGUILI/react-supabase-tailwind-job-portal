import { useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { type FileError, type FileRejection, useDropzone } from "react-dropzone";
import { supabaseClient } from "../supabase/client";

interface FileWithPreview extends File {
  errors: readonly FileError[];
  preview?: string;
}

type UseSupabaseUploadOptions = {
  /**
   * Name of bucket to upload files to in your Supabase project
   */
  bucketName: string;
  /**
   * Folder to upload files to in the specified bucket within your Supabase project.
   *
   * Defaults to uploading files to the root of the bucket
   *
   * e.g If specified path is `test`, your file will be uploaded as `test/file_name`
   */
  path?: string;
  /**
   * Allowed MIME types for each file upload (e.g `image/png`, `text/html`, etc). Wildcards are also supported (e.g `image/*`).
   *
   * Defaults to allowing uploading of all MIME types.
   */
  allowedMimeTypes?: string[];
  /**
   * Maximum upload size of each file allowed in bytes. (e.g 1000 bytes = 1 KB)
   */
  maxFileSize?: number;
  /**
   * Maximum number of files allowed per upload.
   */
  maxFiles?: number;
  /**
   * The number of seconds the asset is cached in the browser and in the Supabase CDN.
   *
   * This is set in the Cache-Control: max-age=<seconds> header. Defaults to 3600 seconds.
   */
  cacheControl?: number;
  /**
   * When set to true, the file is overwritten if it exists.
   *
   * When set to false, an error is thrown if the object already exists. Defaults to `false`
   */
  upsert?: boolean;
};

type UseSupabaseUploadReturn = ReturnType<typeof useSupabaseUpload>;

const useSupabaseUpload = (options: UseSupabaseUploadOptions) => {
  const {
    bucketName,
    path,
    allowedMimeTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
    cacheControl = 3600,
    upsert = false,
  } = options;

  const { session } = useSession();

  const [files, setFilesState] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);
  const [successes, setSuccesses] = useState<string[]>([]);

  const setFiles = (arg: FileWithPreview[] | ((prev: FileWithPreview[]) => FileWithPreview[])) => {
    if (typeof arg === "function") {
      setFilesState(prev => {
        const next = arg(prev);
        if (next.length <= maxFiles) {
          const needsCleanup = next.some(f => f.errors.some(e => e.code === "too-many-files"));
          if (needsCleanup) {
            return next.map(f => ({
              ...f,
              errors: f.errors.filter(e => e.code !== "too-many-files"),
            }));
          }
        }
        return next;
      });
    } else {
      if (arg.length === 0) {
        setErrors([]);
      }
      if (arg.length <= maxFiles) {
        const needsCleanup = arg.some(f => f.errors.some(e => e.code === "too-many-files"));
        if (needsCleanup) {
          setFilesState(
            arg.map(f => ({
              ...f,
              errors: f.errors.filter(e => e.code !== "too-many-files"),
            }))
          );
          return;
        }
      }
      setFilesState(arg);
    }
  };

  const isSuccess =
    errors.length === 0 && successes.length === 0 ? false : errors.length === 0 && successes.length === files.length;

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const existingNames = new Set(files.map(x => x.name));
    const validFiles = acceptedFiles.reduce<FileWithPreview[]>((acc, file) => {
      if (!existingNames.has(file.name)) {
        (file as FileWithPreview).preview = URL.createObjectURL(file);
        (file as FileWithPreview).errors = [];
        acc.push(file as FileWithPreview);
      }
      return acc;
    }, []);

    const invalidFiles = fileRejections.map(({ file, errors }) => {
      (file as FileWithPreview).preview = URL.createObjectURL(file);
      (file as FileWithPreview).errors = errors;
      return file as FileWithPreview;
    });

    const newFiles = [...files, ...validFiles, ...invalidFiles];

    setFiles(newFiles);
  };

  const dropzoneProps = useDropzone({
    accept: allowedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles,
    maxSize: maxFileSize,
    multiple: maxFiles !== 1,
    noClick: true,
    onDrop,
  });

  const onUpload = async () => {
    setLoading(true);

    // [Joshen] This is to support handling partial successes
    // If any files didn't upload for any reason, hitting "Upload" again will only upload the files that had errors
    const errorFileNames = new Set(errors.map(x => x.name));
    const successFileNames = new Set(successes);
    const filesToUpload =
      errorFileNames.size > 0
        ? [...files.filter(f => errorFileNames.has(f.name)), ...files.filter(f => !successFileNames.has(f.name))]
        : files;

    const supabaseAccessToken = await session?.getToken({ template: "supabase" });
    const supabase = await supabaseClient(supabaseAccessToken as string);

    const responses = await Promise.all(
      filesToUpload.map(async file => {
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(!!path ? `${path}/${file.name}` : file.name, file, {
            cacheControl: cacheControl.toString(),
            upsert,
          });
        if (error) {
          return { message: error.message, name: file.name };
        } else {
          return { message: undefined, name: file.name };
        }
      })
    );

    const responseErrors = responses.filter(x => x.message !== undefined);
    // if there were errors previously, this function tried to upload the files again so we should clear/overwrite the existing errors.
    setErrors(responseErrors);

    const responseSuccesses = responses.filter(x => x.message === undefined);
    const newSuccesses = Array.from(new Set([...successes, ...responseSuccesses.map(x => x.name)]));
    setSuccesses(newSuccesses);

    setLoading(false);
  };

  return {
    allowedMimeTypes,
    errors,
    files,
    isSuccess,
    loading,
    maxFileSize: maxFileSize,
    maxFiles: maxFiles,
    onUpload,
    setErrors,
    setFiles,
    successes,
    ...dropzoneProps,
  };
};

export { type UseSupabaseUploadOptions, type UseSupabaseUploadReturn, useSupabaseUpload };
