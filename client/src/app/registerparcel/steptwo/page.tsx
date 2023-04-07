"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ParcelRegistration } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/parcels";
import { PeopleInfoForm } from "colorblind/app/registerparcel/steptwo/components/PeopleInfoForm";

export default function StepTwo() {
  const [registration, setRegistration] =
    useState<ParcelRegistration>(defaultRegistration);
  const [error, setError] = useState<Error>();
  const router = useRouter();
  const onSubmit = async (value: ParcelRegistration): Promise<void> => {
    await register(value)
      .then((x) => router.replace(`/${x.registrationCode}`))
      .catch((x) => setError(x));
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const reg = localStorage.getItem("registration");
    if (!reg) {
      router.replace("/registerparcel/stepone");
      return;
    }

    try {
      setRegistration(JSON.parse(reg));
    } catch (e) {
      router.replace("/registerparcel/stepone");
    }
  }, [router]);

  return (
    <div className={styles.form}>
      <PeopleInfoForm
        defaultValue={{ ...registration }}
        onSubmit={(data) => {
          setRegistration({ ...registration, ...data });
          onSubmit(registration);
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
