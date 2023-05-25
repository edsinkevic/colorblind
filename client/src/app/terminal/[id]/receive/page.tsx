"use client";
import styles from "../../page.module.css"
import { MouseEventHandler, useState } from "react";
import { FormInput } from "colorblind/shared/components/FormInput";
import { getOneByCode, receive } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  ParcelStatus,
  Problem,
  StatusCodes,
} from "colorblind/shared/lib/models/models";
import { useRouter } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function TerminalReceive({ params: { id } }: Props) {
  const [error, setError] = useState<string>();
  const [code, setCode] = useState<string>("");
  const [parcel, setParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const router = useRouter();

  const fetchParcel = async () => {
    const parcelResponse = await getOneByCode(code);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      setError(problem.detail);
      return;
    }

    const fetchedParcel = (await parcelResponse.json()) as ParcelDetails;

    if (fetchedParcel.status !== ParcelStatus.DELIVERED) {
      setError("Parcel was not delivered yet!");
      return;
    }

    setParcel(fetchedParcel);
    setError(undefined);
  };

  const onApplyCode: MouseEventHandler = async (e) => {
    e.preventDefault();
    await fetchParcel();
  };

  const onLockerOpen: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!parcel || error) return;
    const response = await receive(code, parcel.version);
  
    if (response.status === StatusCodes.Conflict) {
      const problem = (await response.json()) as Problem;
      setError(problem.detail);
      await fetchParcel();
      return;
    }
  
    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      setError(problem.detail);
      return;
    }

    const { lockerNumber } = (await response.json()) as { lockerNumber: number };

    setLockerNumber(lockerNumber);
  };

  const onSubmit: MouseEventHandler = async (e) => {
    e.preventDefault();

    setError(undefined);
    await router.push(`/terminal/${id}`);
  };

  return (
    <div className={styles.form}>
      <form>
        <h1>Enter parcel code</h1>
        <FormInput
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        {parcel ? JSON.stringify(parcel) : null }
        <button className={styles.bigButton} onClick={onApplyCode}>Apply code</button>
        {parcel ? <button className={styles.bigButton} onClick={onLockerOpen}>Open locker</button> : null}
        {lockerNumber ? (
          <button className={styles.bigButton} onClick={onSubmit}>Close locker {lockerNumber}</button>
        ) : null}
        {successMessage}
        {error}
      </form>
    </div>
  );
}
