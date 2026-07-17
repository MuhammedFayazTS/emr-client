import { useQuery } from "@tanstack/react-query";
import { authKeys } from "../api/auth.keys";
import { authApi } from "../api/auth.api";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getMe,
    staleTime: 5 * 60 * 1000,
    retry: false, // don't retry a 401
  });
}
