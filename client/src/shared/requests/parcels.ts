import {
  ParcelRegistration,
  ParcelRegistrationResponse,
} from "../lib/models/models";
export const registerParcel = (parcelRegistration: ParcelRegistration) =>
  fetch(`${process.env.colorblindServerUrl}/parcels/register`, {
    method: "POST",
    body: JSON.stringify(parcelRegistration),
  })
    .then((resp) => resp.json())
    .then((data) => data as ParcelRegistrationResponse);
