"use client";

import { FormInput } from "colorblind/shared/components/FormInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { getFromStore, store } from "colorblind/shared/lib/state";
import { PickerFromArray } from "colorblind/shared/components/PickerFromArray";

interface Props {}

export default function ParcelDetailsPage({}: Props) {
  const [code, setCode] = useState<string>("");
  const router = useRouter();
  const [recentlyTracked, setRecentlyTracked] = useState<string[]>([]);

  const storeRecentlyTracked = (code: string) => {
    const recentlyTracked = getFromStore<string[]>("recentlyTracked");
    if (!recentlyTracked) {
      store("recentlyTracked", [code]);
      return;
    }
    const alreadyThere = recentlyTracked.find((v, _n, _s) => v === code);

    if (!alreadyThere) store("recentlyTracked", [...recentlyTracked, code]);
  };

  useEffect(() => {
    const recentlyTracked = getFromStore<string[]>("recentlyTracked");

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
