import { detailsGetOne } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

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
    return (
      <div className={styles.info}>
        <div>
          <h1>Order placed!</h1>
          <p>Your order code is: {body.code}</p>
          <p>
            Place your order into the locker located at :
            {/* Retreive locker address based on terminalId */}
            {body.senderDeliveryInfo.parcelLockerAddress}
          </p>
        </div>
      </div>
    )
  }

  if (status === StatusCodes.NOT_FOUND) {
    notFound();
    return null;
  }

  throw new Error("Something went super wrong!");
}
