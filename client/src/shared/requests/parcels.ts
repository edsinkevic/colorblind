import {
  ParcelRegistration,
  ParcelRegistrationResponse,
  Problem,
} from "../lib/models/models";

import * as E from "fp-ts/Either";
import { colorblindServerUrl, defaultFetchConfig } from "./shared";

export const registerParcel = async (
  parcelRegistration: ParcelRegistration
): Promise<E.Either<Error, ParcelRegistrationResponse>> => {
  const resp = await fetch(colorblindServerUrl("/parcels/register"), {
    ...defaultFetchConfig,
    method: "POST",
    body: JSON.stringify(parcelRegistration),
  });

  if (resp.status === 200) {
    const data = await resp.json();
    return E.right(data as ParcelRegistrationResponse);
  }

  if (resp.status === 400) {
    const data = await resp.json();
    const error = new Error((data as Problem).title);
    return E.left(error);
  }

  return E.left(new Error("Something went super wrong!"));
};
