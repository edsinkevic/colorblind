import Link from "next/link";
import styles from "./page.module.css";

interface Props {
  params: {
    id: string;
  };
}

export default function TerminalHome({ params: { id } }: Props) {
  return (
    <>
      <div className={styles.info}>
        <div>
          <h1>Terminal</h1>
            <p>Enter courier</p>
            <Link href={`/terminal/${id}/courier`}>
              <button className={styles.bigButton}>Courier environment</button>
            </Link>
          
            <p>Submit a parcel to this terminal</p>
            <Link href={`/terminal/${id}/submit`}>
              <button className={styles.bigButton}>Submit parcel</button>
            </Link>
        </div>
      </div>
    </>
  );
}
