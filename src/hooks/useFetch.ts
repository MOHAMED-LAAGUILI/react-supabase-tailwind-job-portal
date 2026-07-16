import { useSession } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";

const useFetch = <T, O = Record<string, unknown>>(
  cb: (token: string, options: O, ...args: unknown[]) => Promise<T | null>,
  options: O = {} as O
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<unknown>(null);

  const { session } = useSession();

  const cbRef = useRef(cb);
  const optionsRef = useRef(options);
  useEffect(() => {
    cbRef.current = cb;
    optionsRef.current = options;
  });

  const fn = async (...args: unknown[]) => {
    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session?.getToken({
        template: "supabase",
      });
      const response = await cbRef.current(supabaseAccessToken!, optionsRef.current, ...args);
      setData(response ?? undefined);
      setError(null);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  };

  return { data, error, fn, loading };
};

export default useFetch;
