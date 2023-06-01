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

export const detailsWithEvent = (id: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/events/${id}`), {
    ...defaultFetchConfig,
    method: "GET",
  });

export const detailsGetByTerminalId = (terminalID: string, auth: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/terminal/${terminalID}`), {
    ...defaultFetchConfig,
    headers: {
      ...defaultFetchConfig.headers,
      "Authorization": auth,
    },
    method: "GET",
  });

export const detailsGetByCourierIdForTerminal = (
  auth: string,
  terminalID: string
): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/courier/${terminalID}`), {
    ...defaultFetchConfig,
    headers: {
      ...defaultFetchConfig.headers,
      "Authorization": auth,
    },
    method: "GET",
  });

export const getOneByCode = (code: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/code/${code}`), {
    ...defaultFetchConfig,
    method: "GET",
  });

export const ship = (
  code: string,
  version: number,
  auth: string
): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/${code}/ship`), {
    ...defaultFetchConfig,
    headers: {
      ...defaultFetchConfig.headers,
      "If-Match": `"${version}"`,
      "Authorization": auth
    },
    method: "POST",
  });

export const deliver = (
  code: string,
  terminalId: string,
  version: number
): Promise<Response> =>
  fetch(
    colorblindServerUrl(`/parcels/${code}/deliver/terminal/${terminalId}`),
    {
      ...defaultFetchConfig,
      headers: {
        ...defaultFetchConfig.headers,
        "If-Match": `"${version}"`,
      },
      method: "POST",
    }
  );

export const submit = (
  code: string,
  terminalId: string,
  version: number
): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/${code}/submit/terminal/${terminalId}`), {
    ...defaultFetchConfig,
    headers: {
      ...defaultFetchConfig.headers,
      "If-Match": `"${version}"`,
    },
    method: "POST",
  });

export const receive = (code: string, version: number): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/${code}/receive`), {
    ...defaultFetchConfig,
    headers: {
      ...defaultFetchConfig.headers,
      "If-Match": `"${version}"`,
    },
    method: "POST",
  });
