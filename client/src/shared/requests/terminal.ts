import { RegisterTerminal } from "colorblind/shared/lib/models/models";
import {
  colorblindServerUrl,
  defaultFetchConfig,
} from "colorblind/shared/requests/shared";

export const register = (data: RegisterTerminal): Promise<Response> =>
  fetch(colorblindServerUrl(`/terminals`), {
    ...defaultFetchConfig,
    body: JSON.stringify(data),
    method: "POST",
  });

export const getAll = (): Promise<Response> =>
  fetch(colorblindServerUrl(`/terminals`), {
    ...defaultFetchConfig,
    method: "GET",
  });

export const getOne = (id: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/terminals/${id}`), {
    ...defaultFetchConfig,
    method: "GET",
  });
