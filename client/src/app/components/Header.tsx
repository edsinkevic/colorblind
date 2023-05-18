import styles from "./Header.module.css";
import Link from "next/link";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <Link href="/" className={styles.titleContainer}>
        <button className={styles.headerButton}>FastMail</button>
      </Link>
      <div className={styles.buttonContainer}>
        <Link href={"/terminal"}>
          <button className={styles.headerButton}>Terminal environment</button>
        </Link>
        <Link href={"/admin"}>
          <button className={styles.headerButton}>Admin environment</button>
        </Link>
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
