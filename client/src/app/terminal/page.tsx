"use client";

import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Problem,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getAll } from "colorblind/shared/requests/terminal";
import { TerminalPicker } from "colorblind/shared/components/TerminalPicker";

export default function StepOne() {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();
  const [terminals, setTerminals] = useState<TerminalDetails[]>([]);
  const [pickedTerminalId, setPickedTerminalId] = useState<string>();

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

  return (
    <div className={styles.form}>
      <form
        onSubmit={() => {
          router.push(`terminal/${pickedTerminalId}`);
        }}
      >
        <TerminalPicker
          terminals={terminals}
          onSubmit={(terminalId) => {
            setPickedTerminalId(terminalId);
          }}
        />
        <button type="submit" disabled={!pickedTerminalId}>
          Submit
        </button>
        {problem ? JSON.stringify(problem) : null}
      </form>
    </div>
  );
}
