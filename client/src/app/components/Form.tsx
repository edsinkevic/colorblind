import styles from "./Form.module.css";
import { useEffect, useState } from "react";
import { ParcelRegistration } from "../../shared/lib/models/models";
import { register } from "../../shared/requests/parcels";
import { PeopleInfoForm } from "colorblind/app/components/PeopleInfoForm";
import { ParcelInfoForm } from "colorblind/app/components/ParcelInfoForm";
import { useRouter } from "next/navigation";

export default function Form() {
  const [sectionIdx, setSectionIdx] = useState<number>(0);
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

  const [registration, setRegistration] =
    useState<ParcelRegistration>(defaultRegistration);
  return (
    <div className={styles.form}>
      {sectionIdx == 0 ? (
        <ParcelInfoForm
          defaultValue={{ ...registration }}
          onSubmit={(info) => {
            setRegistration({ ...registration, ...info });
            setSectionIdx(sectionIdx + 1);
          }}
        />
      ) : null}

      {sectionIdx == 1 ? (
        <PeopleInfoForm
          defaultValue={{ ...registration }}
          onSubmit={(data) => {
            setRegistration({ ...registration, ...data });
            onSubmit(registration);
          }}
        />
      ) : null}
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