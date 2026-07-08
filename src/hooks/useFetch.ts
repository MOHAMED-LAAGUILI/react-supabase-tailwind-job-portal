import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = <T, O = Record<string, unknown>>(
  cb: (token: string, options: O, ...args: unknown[]) => Promise<T | null>,
  options: O = {} as O
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<unknown>(null);

  const { session } = useSession();

  const fn = async (...args: unknown[]) => {
    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session?.getToken({
        template: "supabase",
      });
      const response = await cb(supabaseAccessToken!, options, ...args);
      setData(response ?? undefined);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, fn, loading };
};

export default useFetch;
