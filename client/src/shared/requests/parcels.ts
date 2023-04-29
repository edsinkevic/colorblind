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

export const detailsGetOne = (code: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/parcels/${code}`), {
    ...defaultFetchConfig,
    method: "GET",
  })
