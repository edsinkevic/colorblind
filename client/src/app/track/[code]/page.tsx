import { detailsGetOne } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { notFound } from "next/navigation";

interface Props {
  params: {
    code: string;
  };
}

export default async function ParcelDetailsPage({ params: { code } }: Props) {
  const parcelDetails = await detailsGetOne(code);
  const { status } = parcelDetails;

  if (status === StatusCodes.OK) {
    const body = (await parcelDetails.json()) as ParcelDetails;
    return <>{JSON.stringify(body)}</>;
  }

  if (status === StatusCodes.NOT_FOUND) {
    notFound();
    return null;
  }

  throw new Error("Something went super wrong!");
}
