"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ParcelRegistration,
  ParcelRegistrationResponse,
  Problem,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/parcels";
import { PeopleInfoForm } from "colorblind/app/registerparcel/steptwo/components/PeopleInfoForm";
import { getFromStore } from "colorblind/shared/lib/state";
import { FormWithStatus } from "../components/FormWithStatus";
import { getAll } from "colorblind/shared/requests/terminal";

type Props = {
  terminals: TerminalDetails[];
};

export default function StepTwo() {
  const [registration, setRegistration] = useState<ParcelRegistration>();
  const [error, setError] = useState<Error>();
  const router = useRouter();
  const [terminals, setTerminals] = useState<TerminalDetails[]>([]);
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    const reg = getFromStore<ParcelRegistration>("registration");
    if (!reg) {
      router.replace("/registerparcel/stepone");
      return;
    }

    setRegistration(reg);
  }, [router]);

  useEffect(() => {
    const fetchTerminals = async () => {
      const response = await getAll();

      if (response.status !== StatusCodes.OK) {
        const body = (await response.json()) as Problem;
        setProblem(body);
        return;
      }

      const terminals = (await response.json()) as TerminalDetails[];
      setTerminals(terminals);
    };

    fetchTerminals();
  }, []);

  const onSubmit = async (value: ParcelRegistration): Promise<void> => {
    const resp = await register(value);
    const { status } = resp;

    if (status !== StatusCodes.OK) {
      const body = (await resp.json()) as Problem;
      setProblem(body);
      return;
    }

    const body = (await resp.json()) as ParcelRegistrationResponse;
    router.replace(`/track/${body.id}`);
  };

  if (!registration) return null;

  return (
    <FormWithStatus current={2}>
      <div className={styles.form}>
        {error ? JSON.stringify(error) : null}
        {problem ? JSON.stringify(problem) : null}
        <PeopleInfoForm
          terminals={terminals}
          defaultValue={{ ...registration }}
          onSubmit={(data) => {
            onSubmit({ ...registration, ...data });
          }}
        />
      </div>
    </FormWithStatus>
  );
}
