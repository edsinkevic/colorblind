import { detailsGetOne } from "colorblind/shared/requests/parcels";

import * as E from "fp-ts/Either";
import { ParcelDetails } from "colorblind/shared/lib/models/models";

interface Props {
  params: {
    parcelDetails: ParcelDetails;
    code: string;
  };
}

export default async function ParcelDetailsPage({ params: { code } }: Props) {
  const parcelDetails = await detailsGetOne(code);

  return (
    <>
      <h1>
        {code}
        {JSON.stringify(parcelDetails)}
      </h1>
    </>
  );
}
