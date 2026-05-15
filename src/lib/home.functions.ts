import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type HomeDay = {
  id: string;
  day_number: number;
  title: string;
  audio_url: string | null;
  respiration_text: string | null;
  reflection_text: string | null;
  is_rest: boolean;
};

export type HomeWeek = {
  id: string;
  title: string;
  order_index: number;
  thumbnail_url: string | null;
  days: HomeDay[];
};

export type HomeProfile = {
  name: string;
  avatarUrl: string | null;
};

export const getWeeksWithDays = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<HomeWeek[]> => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("weeks")
      .select(
        "id, title, order_index, thumbnail_url, days(id, day_number, title, audio_url, respiration_text, reflection_text, is_rest)",
      )
      .order("order_index", { ascending: true })
      .order("day_number", { foreignTable: "days", ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((w) => ({
      id: w.id,
      title: w.title,
      order_index: w.order_index,
      thumbnail_url: w.thumbnail_url ?? null,
      days: (w.days ?? []).map((d) => ({
        id: d.id,
        day_number: d.day_number,
        title: d.title,
        audio_url: d.audio_url ?? null,
        respiration_text: d.respiration_text ?? null,
        reflection_text: d.reflection_text ?? null,
        is_rest: d.is_rest ?? false,
      })),
    }));
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<HomeProfile> => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    return {
      name: data?.name ?? "Praticante",
      avatarUrl: data?.avatar_url ?? null,
    };
  });

export const getMyProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<string[]> => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_progress")
      .select("day_id")
      .eq("user_id", userId)
      .eq("completed", true);
    return (data ?? []).map((p) => p.day_id);
  });
