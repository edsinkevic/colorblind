"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ParcelRegistration,
  ParcelRegistrationResponse,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/parcels";
import { PeopleInfoForm } from "colorblind/app/registerparcel/steptwo/components/PeopleInfoForm";
import { getFromStore } from "colorblind/shared/lib/state";
import { StatusIndicator } from "../components/StatusIndicator";

export default function StepTwo() {
  const [registration, setRegistration] = useState<ParcelRegistration>();
  const [error, setError] = useState<Error>();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    const reg = getFromStore<ParcelRegistration>("registration");
    if (!reg) {
      router.replace("/registerparcel/stepone");
      return;
    }

    setRegistration(reg);
  }, [router]);

  const onSubmit = async (value: ParcelRegistration): Promise<void> => {
    const resp = await register(value);
    const { status } = resp;

    if (status === StatusCodes.CREATED) {
      const body = (await resp.json()) as ParcelRegistrationResponse;
      router.replace(`/track/${body.code}`);
      return;
    }

    if (status === StatusCodes.BAD_REQUEST) {
      const body = (await resp.json()) as Problem;
      setProblem(body);
      return;
    }

    setError(new Error("Something went supper wrong"));
  };

  if (!registration) return null;

  return (
    <div className={styles.form}>
      {error ? JSON.stringify(error) : null}
      {problem ? JSON.stringify(problem) : null}
      <StatusIndicator current={2} />
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
