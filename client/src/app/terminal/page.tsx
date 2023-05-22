"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Problem,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getAll } from "colorblind/shared/requests/terminal";
import styles from "./page.module.css";
import { Select } from "antd";

export default function StepOne() {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();
  const [error, setError] = useState<string>();
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
      setPickedTerminalId(terminals[0].id);
    };

    fetchTerminals();
  }, []);

  const terminalOptions = terminals.map((terminal) => ({
    value: terminal.id,
    label: terminal.address,
  }));

  const onSelect = (id: string) => setPickedTerminalId(id);
  return (
    <div className={styles.form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/terminal/${pickedTerminalId}`);
        }}
      >
        <h1>Select a terminal</h1>
        <div>
          <Select
            options={terminalOptions}
            onChange={onSelect}
            placeholder="Please select!"
          />
          <button
            type="submit"
            disabled={!pickedTerminalId || !!error || !!problem}
          >
            Submit
          </button>
        </div>
        {problem ? JSON.stringify(problem) : null}
        {error}
      </form>
    </div>
  );
}
