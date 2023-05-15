export const store = <T>(key: string, value: T) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getFromStore = <T>(key: string): T | undefined | null => {
  const reg = localStorage.getItem(key);
  try {
    return reg ? JSON.parse(reg) : null;
  } catch (e) {
    return undefined;
  }
};

const COURIER_STORAGE_KEY = "courier";
export const storeCourier = (id: string) => {
  store(COURIER_STORAGE_KEY, [id]);
};

export const getCourier = () => getFromStore<string>(COURIER_STORAGE_KEY);
