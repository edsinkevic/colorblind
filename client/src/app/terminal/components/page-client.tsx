"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Problem, TerminalDetails } from "colorblind/shared/lib/models/models";
import styles from "../page.module.css";
import { Select } from "antd";

type Props = {
  terminals: TerminalDetails[];
};

export default function PickTerminalClient({ terminals }: Props) {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem>();
  const [error, setError] = useState<string>();
  const [pickedTerminalId, setPickedTerminalId] = useState<string>();

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
