import {
  ParcelRegistration,
  ParcelRegistrationResponse,
} from "../lib/models/models";
export const registerParcel = async (
  parcelRegistration: ParcelRegistration
) => {
  console.log(`${process.env.colorblindServerUrl}`);
  return await fetch(`${process.env.colorblindServerUrl}/parcels/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parcelRegistration),
  })
    .then((resp) => {
      if (resp.status === 200) return resp.json();
      throw new Error("Something went wrong!");
    })
    .then((data) => data as ParcelRegistrationResponse);
};
