import {
  ParcelRegistration,
  ParcelRegistrationResponse,
  Problem,
} from "../lib/models/models";

import * as E from "fp-ts/Either";

export const registerParcel = async (
  parcelRegistration: ParcelRegistration
): Promise<E.Either<Error, ParcelRegistrationResponse>> => {
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
    return E.right((await resp.json()) as ParcelRegistrationResponse);
  if (resp.status === 400)
    return E.left(new Error(((await resp.json()) as Problem).title));

  return E.left(new Error("Something went super wrong!"));
};
