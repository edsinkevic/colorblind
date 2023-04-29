"use client";

import { FormInput } from "colorblind/shared/components/FormInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { PickerFromArray } from "colorblind/shared/components/PickerFromArray";
import {
  getRecentlyTracked,
  storeRecentlyTracked,
} from "colorblind/app/track/components/actions";

interface Props {}

export default function ParcelDetailsPage({}: Props) {
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const [recentlyTracked, setRecentlyTracked] = useState<string[]>([]);

  useEffect(() => {
    const recentlyTracked = getRecentlyTracked();

    if (!recentlyTracked) {
      setRecentlyTracked([]);
      return;
    }

    setRecentlyTracked(recentlyTracked);
    setCode(recentlyTracked.at(0) ?? "");
  }, []);

  return (
    <div className={styles.form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          storeRecentlyTracked(code);
          router.push(`/track/${code}`);
        }}
      >
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
    </div>
  );
}
