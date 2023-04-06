"use client";

import { useState } from "react";
import Form from "./components/Form";
import styles from "./page.module.css";

export default function Home() {
  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <main className={styles.main}>
      {showForm ? <Form /> :
        <>
          <div>
            <div>
              <button onClick={() => setShowForm(true)}>Send package</button>
            </div>
            <div>
              <button>Track package</button>
            </div>
            <div>
              <button>Help</button>
            </div>
          </div>
          <div className={styles.intro}>
            <h1>FastMail</h1>
            <p>
              say goodbye to parcel delivery hassles - experience seamless shipping with us.
            </p>
          </div>
        </>}
    </main >
  );
}