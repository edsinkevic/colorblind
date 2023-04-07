"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { ParcelInfoForm } from "colorblind/app/registerparcel/stepone/components/ParcelInfoForm";
import { useRouter } from "next/navigation";
import { ParcelRegistration } from "colorblind/shared/lib/models/models";

export default function StepOne() {
  const [error, setError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const [registration, setRegistration] =
    useState<ParcelRegistration>(defaultRegistration);

  return (
    <div className={styles.form}>
      <ParcelInfoForm
        defaultValue={{ ...registration }}
        onSubmit={(info) => {
          setRegistration({ ...registration, ...info });
          localStorage.setItem("registration", JSON.stringify(registration));
          router.push("/registerparcel/steptwo");
        }}
      />
    </div>
  );
}

const defaultRegistration: ParcelRegistration = {
  size: "S",
  couponCode: "123",
  transactionCode: "123",
  senderDeliveryInfo: {
    email: "vardas@pavardaitis.com",
    phoneNumber: "+37061095511",
    fullname: "Vardas Pavardaitis",
    parcelLockerAddress: "Druskio g.5",
    takeawayAddress: "",
  },
  receiverDeliveryInfo: {
    email: "vardas@pavardaitis.com",
    phoneNumber: "+37061095511",
    fullname: "Vardas Pavardaitis",
    parcelLockerAddress: "Druskio g.5",
    takeawayAddress: "",
  },
  invoiceEmail: "vardas@pavardaitis",
  deliveryType: {
    from: "terminal",
    to: "terminal",
  },
};
