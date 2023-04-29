"use client";

import styles from "./page.module.css";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "colorblind/shared/components/FormInput";
import { Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { register } from "colorblind/shared/requests/terminal";

export default function StepOne() {
  const [error, setError] = useState<Error>();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resp = await register({ address });

    if (resp.status === StatusCodes.CREATED) {
      // Decide what to do next
      router.replace("/");
      return;
    }

    if (resp.status === StatusCodes.BAD_REQUEST) {
      setProblem(await resp.json());
      return;
    }

    setError(new Error("Something went super wrong!"));
  };

  const [address, setAddress] = useState<string>("");

  return (
    <div className={styles.form}>
      <form onSubmit={onSubmit}>
        <FormInput
          value={address}
          placeholder={"Address"}
          onChange={(e) => {
            e.preventDefault();
            setAddress(e.target.value);
          }}
        ></FormInput>
        <button type="submit">Submit</button>
        {problem ? JSON.stringify(problem) : null}
        {error ? error.message : null}
      </form>
    </div>
  );
}
