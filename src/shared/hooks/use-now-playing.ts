import useSWR from "swr";
import type { SpotifyNowPlayingData } from "@/shared/types/data";
import { fetcher } from "@/utils/misc";

export function useNowPlaying() {
  let { data } = useSWR<SpotifyNowPlayingData>("/api/spotify", fetcher);
  return data || { isPlaying: false };
}
