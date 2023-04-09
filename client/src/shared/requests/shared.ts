import { Problem } from "colorblind/shared/lib/models/models";

export const colorblindServerUrl = (path: string) =>
  `${
    process.env.COLORBLIND_SERVER_URL ??
    process.env.NEXT_PUBLIC_COLORBLIND_SERVER_URL
  }${path}`;

export const defaultFetchConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const defaultResponseHandler = async <T>(resp: Response): Promise<T> => {
  if (resp.status === 400) {
    const data = await resp.json();
    throw new Error((data as Problem).title);
  }

  if (!resp.status.toString().startsWith("2")) {
    const data = await resp.json();
    throw new Error((data as Problem).title);
  }

  const data = await resp.json();
  return data as T;
};
