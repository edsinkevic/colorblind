"use client";

import styles from "./page.module.css";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

export default function StepOne({ params: { id } }: Props) {
  return (
    <div className={styles.form}>
      <h1>{id}</h1>
    </div>
  );
}
