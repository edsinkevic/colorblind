"use client";

import { FormInput } from "colorblind/shared/components/FormInput";
import { FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { PickerFromArray } from "colorblind/shared/components/PickerFromArray";
import {
  getRecentlyTracked,
  storeRecentlyTracked,
} from "colorblind/app/track/components/actions";
import { getOneByCode } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";

interface Props {}

export default function ParcelDetailsPage({}: Props) {
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const [recentlyTracked, setRecentlyTracked] = useState<string[]>([]);
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    const recentlyTracked = getRecentlyTracked();

    if (!recentlyTracked) {
      setRecentlyTracked([]);
      return;
    }

    setRecentlyTracked(recentlyTracked);
    setCode(recentlyTracked.at(0) ?? "");
  }, []);

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const response = await getOneByCode(code);

    if (response.status !== StatusCodes.OK) {
      setProblem(await response.json());
      return;
    }

    const parcel = (await response.json()) as ParcelDetails;

    setProblem(undefined);

    storeRecentlyTracked(code);
    router.push(`/track/${parcel.id}`);
  };

  return (
    <div className={styles.form}>
      <form onSubmit={onSubmit}>
        <h1>Track</h1>
        <FormInput
          placeholder={"Code"}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <PickerFromArray
          hidden={recentlyTracked.at(0) === undefined}
          array={recentlyTracked}
          onSubmit={(code) => setCode(code)}
        ></PickerFromArray>
        <button type={"submit"} disabled={code == ""}>
          Track
        </button>
      </form>
      {JSON.stringify(problem)}
    </div>
  );
}
