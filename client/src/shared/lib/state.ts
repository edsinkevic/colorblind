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
