"use client";

import { detailsGetOne } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { Progress } from "antd";


interface Props {
  params: {
    id: string;
  };
}


export default async function ParcelDetailsPage({ params: { id } }: Props) {
  const parcelDetails = await detailsGetOne(id);
  const { status } = parcelDetails;

  if (status === StatusCodes.OK) {
    const body = (await parcelDetails.json()) as ParcelDetails;
    
    return (
      <div className={styles.info}>
        <div>
          
          <h1>Order placed!</h1>
          <p>Your order code is: {body.code}</p>
          <p>
            Order status :{body.status}
            {/* Retreive locker address based on terminalId */}
            {/* {body.senderDeliveryInfo.parcelLockerAddress} */}
          </p>
          <Progress 
            className={styles.progressBar} 
            percent={body.version * 20} 
            status="active"
            strokeColor={{
              "0%": "#9c2298",
              "100%": "#5384b2"}}
            size={[650, 20]}
            showInfo={false}
            />
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
