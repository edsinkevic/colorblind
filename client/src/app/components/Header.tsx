import styles from "./Header.module.scss";
import Link from "next/link";

export const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <Link href="/" className={styles.titleContainer}>
        <button>FastMail</button>
      </Link>
      <input type={"checkbox"} className={styles.check} />
      <div className={styles.buttonContainer}>
        <Link href={"/terminal"}>
          <button>Terminal environment</button>
        </Link>
        <Link href={"/admin"}>
          <button>Admin environment</button>
        </Link>
        <Link href={"/registerparcel/stepone"}>
          <button>Send Package</button>
        </Link>
        <Link href={"/track"}>
          <button>Track parcel</button>
        </Link>
        <button>F.A.Q.</button>
      </div>
    </div>
  );
};
