import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

export function LogoutController() {
  const authUser = useAuthStore((s) => s.authUser);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser) {
      queryClient.removeQueries({ queryKey: ["messages"] });
    }
  }, [authUser, queryClient]);

  return null;
}
