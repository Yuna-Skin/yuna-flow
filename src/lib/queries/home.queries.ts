import { queryOptions } from "@tanstack/react-query";
import { getWeeksWithDays, getMyProfile, getMyProgress } from "@/lib/home.functions";

export const weeksQueryOptions = () =>
  queryOptions({
    queryKey: ["weeks-with-days"],
    queryFn: () => getWeeksWithDays(),
    staleTime: 10 * 60_000,
  });

export const profileQueryOptions = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: () => getMyProfile(),
    enabled: !!userId,
  });

export const progressQueryOptions = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["user_progress", userId],
    queryFn: () => getMyProgress(),
    enabled: !!userId,
  });
