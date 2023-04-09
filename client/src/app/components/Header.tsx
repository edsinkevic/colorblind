"use client";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export const Header = () => {
  const router = useRouter();

  return (
    <div className={styles.headerContainer}>
      <div onClick={() => router.push("")} className={styles.titleContainer}>
        <h1>FastMail</h1>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.headerButton}
          onClick={() => router.push("/registerparcel/stepone")}
        >
          Send Package
        </button>
        <button
          className={styles.headerButton}
          onClick={() => router.push("/track")}
        >
          Track parcel
        </button>
        <button className={styles.headerButton}>F.A.Q.</button>
      </div>
    </div>
  );
};
