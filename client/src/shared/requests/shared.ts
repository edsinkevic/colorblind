export const colorblindServerUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_COLORBLIND_SERVER_URL}${path}`;

export const defaultFetchConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};
