"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  ParcelRegistration,
  ParcelRegistrationResponse,
} from "../shared/lib/models/models";
import { registerParcel } from "../shared/requests/parcels";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";

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

  const onClick = async () => {
    pipe(
      await registerParcel(parcelRegistration),
      E.match(
        (left) => setError(left),
        (right) => setResult(right)
      )
    );
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
