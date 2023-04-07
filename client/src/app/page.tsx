"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div>
        <div>
          <button
            className={styles.bigButton}
            onClick={() => router.push("/registerparcel/stepone")}
          >
            Send package
          </button>
        </div>
        <div>
          <button className={styles.bigButton}>Track package</button>
        </div>
        <div>
          <button className={styles.bigButton}>Help</button>
        </div>
      </div>
      <div className={styles.intro}>
        <h1>FastMail</h1>
        <p>
          say goodbye to parcel delivery hassles - experience seamless shipping
          with us.
        </p>
      </div>
    </>
  );
}
