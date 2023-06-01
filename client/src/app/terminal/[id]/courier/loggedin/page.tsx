"use client";

import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { fetchCourierFromSession } from "colorblind/shared/requests/couriers";
import {
  Courier,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getOne } from "colorblind/shared/requests/terminal";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { deleteAuth, getAuth } from "colorblind/shared/lib/state";

const logout = (
  router: AppRouterInstance,
  terminalId: string,
  alertMessage: string
) => {
  router.push(`/terminal/${terminalId}`);
  deleteAuth();
  alert(alertMessage);
};

interface Props {
  params: {
    id: string;
  };
}

export default function TerminalCourierEnvironment({ params: { id } }: Props) {
  const [courier, setCourier] = useState<Courier>();
  const [terminal, setTerminal] = useState<TerminalDetails>();
  const [logoutTimer, setLogoutTimer] = useState<number>(60);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoutTimer(logoutTimer - 1);
      if (logoutTimer <= 1) {
        logout(router, id, "You have been logged out due to inactivity");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [logoutTimer, id, router]);

  useEffect(() => {
    const initCourier = async () => {
      const session = getAuth();
      if (!session) {
        router.replace(`/terminal/${id}/courier`);
        return;
      }

      const response = await fetchCourierFromSession(session);

      if (response.status !== StatusCodes.OK) {
        notFound();
      }

      setCourier(await response.json());
    };

    const initTerminal = async () => {
      const response = await getOne(id);
      if (response.status !== StatusCodes.OK) {
        notFound();
      }

      const terminal = await response.json();
      setTerminal(terminal);
    };
    initCourier().then(() => initTerminal());
  }, [id, router]);

  if (!courier || !terminal) {
    return null;
  }

  return (
    <>
      <div className={styles.info}>
        <button
          className={styles.bigButton}
          onClick={() =>
            router.push(
              `/terminal/${id}/courier/loggedin/terminalparcels`
            )
          }
        >
          View terminal parcels
        </button>
        <br />
        <button
          className={styles.bigButton}
          onClick={() =>
            router.push(`/terminal/${id}/courier/loggedin/courierparcels`)
          }
        >
          Deliver parcel
        </button>
        <div>
          <button
            className={styles.bigButtonLogout}
            onClick={() => logout(router, id, "Log out successful")}
          >
            Logout
          </button>
          <br />
          <label>
            For safety reasons you will be logged out in {logoutTimer} seconds
            of inactivity
          </label>
        </div>
      </div>
      <div className={styles.intro}>
        <h1>
          Viewing as Courier: <h2>{courier.name}</h2>
        </h1>
      </div>
    </>
  );
}
