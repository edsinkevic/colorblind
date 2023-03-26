"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  ParcelRegistration,
  ParcelRegistrationResponse,
} from "../shared/lib/models/models";
import { registerParcel } from "../shared/requests/parcels";

const defaultRegistration = {
  size: "S",
  couponCode: "",
  transactionId: "",
  senderInfo: {
    email: "",
    phoneNumber: "",
    fullname: "",
    parcelLockerId: "",
  },
  receiverInfo: {
    email: "",
    phoneNumber: "",
    fullname: "",
    parcelLockerId: "",
  },
};

export default function Home() {
  const [parcelRegistration, setParcelRegistration] =
    useState<ParcelRegistration>(defaultRegistration);
  const [result, setResult] = useState<ParcelRegistrationResponse>();
  const [error, setError] = useState<Error>();

  const onClick = () => {
    registerParcel(parcelRegistration)
      .then(setResult)
      .catch((error) => setError(error));
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <main className={styles.main}>
      {JSON.stringify(parcelRegistration)}
      <br />
      <button onClick={onClick}>Button</button>
      {JSON.stringify(result)}
    </main>
  );
}
