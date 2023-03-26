import {
  ParcelRegistration,
  ParcelRegistrationResponse,
  Problem,
} from "../lib/models/models";

export const registerParcel = async (
  parcelRegistration: ParcelRegistration
) => {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_COLORBLIND_SERVER_URL}/parcels/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parcelRegistration),
    }
  );

  if (resp.status === 200)
    return (await resp.json()) as ParcelRegistrationResponse;
  if (resp.status === 400)
    throw new Error(((await resp.json()) as Problem).title);
};
