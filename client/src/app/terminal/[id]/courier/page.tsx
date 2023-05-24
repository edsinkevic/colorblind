"use client";

import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Courier,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { query } from "colorblind/shared/requests/couriers";
import { FormInput } from "colorblind/shared/components/FormInput";

interface Props {
  params: { id: string };
}

export default function PickCourier({ params: { id } }: Props) {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();
  const [error, setError] = useState<string>();
  const [courierName, setCourierName] = useState<string>();
  const [courierPassword, setCourierPassword] = useState<string>();
  const [courier, setCourier] = useState<Courier>();

  useEffect(() => {
    const fetchCourier = async () => {
      const response = await query(courierName);

      if (response.status !== StatusCodes.OK) {
        const body = (await response.json()) as Problem;
        setProblem(body);
        return;
      }

      const couriers = (await response.json()) as Courier[];

      if (couriers.length === 0) {
        setError("Courier not found!");
        return;
      }

      setCourier(couriers[0]);
      setError(undefined);
    };

    fetchCourier();
  }, [courierName]);

  return (
    <div className={styles.form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (courier) router.push(`/terminal/${id}/courier/${courier.id}`);
        }}
      >
        <h1>Log-in</h1>
        <FormInput
          placeholder="Username "
          value={courierName}
          onChange={(e) => {
            e.preventDefault();
            setCourierName(e.target.value);
          }}
        />
        <FormInput
          type="password"
          placeholder="Password "
          value={courierPassword}
          onChange={(e) => {
            e.preventDefault();
            setCourierPassword(e.target.value);
          }}
        />
        <button type="submit" className={styles.bigButton} disabled={!courierName}>
          Login
        </button>
        {problem ? JSON.stringify(problem) : null}
        {error}
      </form>
    </div>
  );
}
