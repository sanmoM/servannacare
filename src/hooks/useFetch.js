import { getApi } from "@/lib/apiHandler";
import { useQuery } from "@tanstack/react-query";

export const useFetch = (endpoint, params = {}, options = {}) => {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: () => getApi(endpoint, params),
    ...options,
  });
};
