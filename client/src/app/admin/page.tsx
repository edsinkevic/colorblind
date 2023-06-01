import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <div>
          <Link href={"/admin/registerterminal"}>
            <button className={styles.bigButton}>Register terminal</button>
          </Link>
        </div>
        <div>
          <Link href={"/admin/approvecourier"}>
            <button className={styles.bigButton}>Approve couriers</button>
          </Link>
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
