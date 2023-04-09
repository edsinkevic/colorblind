"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ParcelRegistration } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/parcels";
import { PeopleInfoForm } from "colorblind/app/registerparcel/steptwo/components/PeopleInfoForm";
import { getFromStore } from "colorblind/shared/lib/state";

export default function StepTwo() {
  const [registration, setRegistration] = useState<ParcelRegistration>();
  const [error, setError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const reg = getFromStore<ParcelRegistration>("registration");
    if (!reg) {
      router.replace("/registerparcel/stepone");
      return;
    }

    setRegistration(reg);
  }, [router]);

  const onSubmit = async (value: ParcelRegistration): Promise<void> => {
    await register(value)
      .then((x) => router.replace(`/track/${x.code}`))
      .catch((x) => setError(x));
  };

  if (!registration) return null;

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
