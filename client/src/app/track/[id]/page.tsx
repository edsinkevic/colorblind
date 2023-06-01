"use client";

import { detailsWithEvent } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  ParcelDetailsWithEvent,
  ParcelEvent,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { Progress, Row } from "antd";

interface Props {
  params: {
    id: string;
  };
}

export default async function ParcelDetailsPage({ params: { id } }: Props) {
  const parcelDetails = await detailsWithEvent(id);
  const { status } = parcelDetails;
  if (status === StatusCodes.OK) {
    const body = (await parcelDetails.json()) as ParcelDetailsWithEvent;

    const eventTypeNameMapper = (event: ParcelEvent): string => {
      switch (event.eventTypeName) {
        case "parcel_registered":
          return "Parcel registered";
        case "parcel_submitted_to_terminal":
          return `Parcel placed in ${body.senderTerminalAddress} terminal`;
        case "parcel_shipped":
          return `Parcel picked up by courier ${event.courierName}`;
        case "parcel_delivered":
          return `Parcel delivered to ${body.receiverTerminalAddress} terminal`;
        case "parcel_received":
          return "Parcel received";
        default:
          return event.eventTypeName;
      }
    }

    const parcelStatusMapper = (status: string): string => {
      switch (status) {
        case "Registered":
          return `Parcel was succesfully registered. Waiting for you to place it in the ${body.senderTerminalAddress} terminal.`;
        case "Submitted":
          return `Parcel was succesfully placed in the ${body.senderTerminalAddress} terminal. Waiting for courier to pick it up.`;
        case "Shipped":
          return `Parcel was succesfully picked up by courier ${body.events[0].courierName}. Waiting for it to be delivered to the ${body.receiverTerminalAddress} terminal.`;
        case "Delivered":
          return `Parcel was succesfully delivered to the ${body.receiverTerminalAddress} terminal. Waiting for you to pick it up.`;
        case "Received":
          return `Parcel was succesfully picked up from the ${body.receiverTerminalAddress} terminal. Thank you for using our services!`;
        default:
          return status;
      }
    }

    return (
      <div className={styles.info}>
        <div>
          <h1>{body.parcel.status === "Registered" ? "Order placed!" : "Parcel overview"}</h1>
          <p>Order code: {<h3 style={{display: "inline-block", marginBottom: "0"}}>{body.parcel.code}</h3>}</p>
          <p>
            Status: {parcelStatusMapper(body.parcel.status)}
            {/* Retreive locker address based on terminalId */}
            {/* {body.senderDeliveryInfo.parcelLockerAddress} */}
          </p>
          <Progress
            className={styles.progressBar}
            percent={body.parcel.version * 20}
            status="active"
            strokeColor={{
              "0%": "#9c2298",
              "100%": "#5384b2",
            }}
            size={[650, 20]}
            showInfo={false}
          />
          <div>
            <h2>Tracking details</h2>
            <div className={styles.details}>
              {body.events.map((event, i) => {
                const [date, time] = new Date(event.timeStamp).toLocaleString("lt-LT").split(" ");
                return (
                  <div key={event.timeStamp} className={i === 0 ? styles.first : ""}>
                    <Row justify="start" align="middle">
                    <div>
                      <div>{date}</div>
                      <div>{time}</div>
                    </div>
                    <div className={styles.circle} />
                    {eventTypeNameMapper(event)}
                    </Row>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === StatusCodes.NOT_FOUND) {
    notFound();
    return null;
  }

  throw new Error("Something went super wrong!");
}

