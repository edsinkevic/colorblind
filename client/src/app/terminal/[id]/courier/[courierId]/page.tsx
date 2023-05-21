"use client";

import React, { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { fetchCourier } from "colorblind/shared/requests/couriers";
import {
  Courier,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getOne } from "colorblind/shared/requests/terminal";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

const logout = (router: AppRouterInstance, terminalId: string, alertMessage: string) => {
  router.push(`/terminal/${terminalId}`);
  alert(alertMessage);
};

interface Props {
  params: {
    id: string;
    courierId: string;
  };
}

export default function TerminalCourierEnvironment({
  params: { id, courierId },
}: Props) {
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
      const response = await fetchCourier(courierId);

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
    initCourier();
    initTerminal();
  }, [courierId, id]);

  if (!courier || !terminal) {
    return null;
  }

  return (
    <div className={"form"}>
      <h1>Viewing as {courier.name}</h1>
      
      <button onClick={() => router.push(`/terminal/${id}/courier/${courierId}/terminalparcels`)}>View terminal parcels</button>
      <br />
      <button onClick={() => router.push(`/terminal/${id}/courier/${courierId}/courierparcels`)}>Deliver parcel</button>
      <div>
        <label>For safety reasons you will be logged out in {logoutTimer} seconds of inactivity</label>
        <br />
        <button onClick={() => logout(router, id, "Log out successful")}>Logout</button>
      </div>
    </div>
  );
}
