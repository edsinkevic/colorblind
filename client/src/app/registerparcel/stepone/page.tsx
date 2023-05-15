"use client";

import styles from "./page.module.css";
import { ParcelInfoForm } from "colorblind/app/registerparcel/stepone/components/ParcelInfoForm";
import { useRouter } from "next/navigation";
import { ParcelRegistration } from "colorblind/shared/lib/models/models";
import { store } from "colorblind/shared/lib/state";
import { FormWithStatus } from "../components/FormWithStatus";

export default function StepOne() {
  const router = useRouter();

  return (
    <FormWithStatus current={1}>
      <div className={styles.form}>
        <ParcelInfoForm
          defaultValue={{ ...defaultRegistration }}
          onSubmit={(info) => {
            const registration = { ...defaultRegistration, ...info };
            store("registration", registration);
            router.push("/registerparcel/steptwo");
          }}
        />
      </div>
    </FormWithStatus>
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
    takeawayAddress: "",
  },
  receiverDeliveryInfo: {
    email: "vardas@pavardaitis.com",
    phoneNumber: "+37061095511",
    fullname: "Vardas Pavardaitis",
    takeawayAddress: "",
  },
  invoiceEmail: "vardas@pavardaitis",
  deliveryType: {
    from: "terminal",
    to: "terminal",
  },
};
