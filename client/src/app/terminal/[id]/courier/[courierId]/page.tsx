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
  const router = useRouter();

  useEffect(() => {
    const initCourier = async () => {
      const response = await fetchCourier(courierId);

      if (response.status !== StatusCodes.OK) {
        notFound();
        return;
      }

      setCourier(await response.json());
    };

    const initTerminal = async () => {
      const response = await getOne(id);
      if (response.status !== StatusCodes.OK) {
        notFound();
        return;
      }

      setTerminal(await response.json());
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
      <h2>Submitted parcels: {terminal.parcelIds}</h2>
    </div>
  );
}
