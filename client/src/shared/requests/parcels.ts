import {
  ParcelDetails,
  ParcelRegistration,
  ParcelRegistrationResponse,
} from "../lib/models/models";
import {
  colorblindServerUrl,
  defaultFetchConfig,
  defaultResponseHandler,
} from "./shared";

export const register = (
  parcelRegistration: ParcelRegistration
): Promise<ParcelRegistrationResponse> =>
  fetch(colorblindServerUrl("/parcels/register"), {
    ...defaultFetchConfig,
    method: "POST",
    body: JSON.stringify(parcelRegistration),
  }).then(defaultResponseHandler<ParcelRegistrationResponse>);

export const detailsGetOne = (code: string): Promise<ParcelDetails> =>
  fetch(colorblindServerUrl(`/parcels/${code}`), {
    ...defaultFetchConfig,
    method: "GET",
  }).then(defaultResponseHandler<ParcelDetails>);
