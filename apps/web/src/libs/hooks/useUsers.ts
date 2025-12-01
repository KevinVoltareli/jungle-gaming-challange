import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api";
import type { UserDto } from "../api/types";

export function useUsers() {
  const usersQuery = useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: () => usersApi.listUsers(),
  });

  return { usersQuery };
}
