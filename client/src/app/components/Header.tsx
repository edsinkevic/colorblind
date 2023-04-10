import styles from "./Header.module.css";
import Link from "next/link";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <Link href="/" className={styles.titleContainer}>
        <h1>FastMail</h1>
      </Link>
      <div className={styles.buttonContainer}>
        <Link href={"/registerparcel/stepone"}>
          <button className={styles.headerButton}>Send Package</button>
        </Link>
        <Link href={"/track"}>
          <button className={styles.headerButton}>Track parcel</button>
        </Link>
        <button className={styles.headerButton}>F.A.Q.</button>
      </div>
    </div>
  );
};
