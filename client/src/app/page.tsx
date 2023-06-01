import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <div>
          <Link href={"/registerparcel/stepone"}>
            <button className={styles.bigButton}>Send package</button>
          </Link>
        </div>
        <div>
          <Link href={"/track"}>
            <button className={styles.bigButton}>Track package</button>
          </Link>
        </div>

        <div>
          <Link href={"/registercourier"}>
            <button className={styles.bigButton}>Register as a courier</button>
          </Link>
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
