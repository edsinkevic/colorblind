import { ParcelRegistration } from "../lib/models/models";
import { colorblindServerUrl, defaultFetchConfig } from "./shared";

export const register = (
  parcelRegistration: ParcelRegistration
): Promise<Response> =>
  fetch(colorblindServerUrl("/parcels/register"), {
    ...defaultFetchConfig,
    method: "POST",
    body: JSON.stringify(parcelRegistration),
  });

export const detailsGetOne = (id: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/${id}`), {
    ...defaultFetchConfig,
    method: "GET",
  });

export const getOneByCode = (code: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/code/${code}`), {
    ...defaultFetchConfig,
    method: "GET",
  });

export const submit = (
  code: string,
  terminalId: string,
  version: string
): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/${code}/submit/terminal/${terminalId}`), {
    ...defaultFetchConfig,
    headers: {
      ...defaultFetchConfig.headers,
      "If-Match": `"${version}"`,
    },
    method: "POST",
  });
