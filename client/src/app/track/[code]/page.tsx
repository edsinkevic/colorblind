import { detailsGetOne } from "colorblind/shared/requests/parcels";
import { ParcelDetails } from "colorblind/shared/lib/models/models";

interface Props {
  params: {
    parcelDetails: ParcelDetails;
    code: string;
  };
}

export default async function ParcelDetailsPage({ params: { code } }: Props) {
  const parcelDetails = await detailsGetOne(code);

  return <>{JSON.stringify(parcelDetails)}</>;
}
