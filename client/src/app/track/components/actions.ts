import { getFromStore, store } from "colorblind/shared/lib/state";

const TRACKED_STORAGE_KEY = "recentlyTracked";
export const storeRecentlyTracked = (code: string) => {
  const recentlyTracked = getFromStore<string[]>("recentlyTracked");
  if (!recentlyTracked) {
    store(TRACKED_STORAGE_KEY, [code]);
    return;
  }
  const alreadyThere = recentlyTracked.find((v) => v === code);
  if (!alreadyThere)
    store(TRACKED_STORAGE_KEY, [code, ...recentlyTracked].slice(0, 10));
};

export const getRecentlyTracked = () => getFromStore<string[]>(TRACKED_STORAGE_KEY);
