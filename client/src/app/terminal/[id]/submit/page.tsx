"use client";
import { MouseEventHandler, useState } from "react";
import { FormInput } from "colorblind/shared/components/FormInput";
import { getOneByCode, submit } from "colorblind/shared/requests/parcels";
import {
  ParcelDetails,
  ParcelStatus,
  Problem,
  StatusCodes,
  SubmitResponse,
} from "colorblind/shared/lib/models/models";
import { useRouter } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function TerminalSubmit({ params: { id } }: Props) {
  const [error, setError] = useState<string>();
  const [code, setCode] = useState<string>("");
  const [parcel, setParcel] = useState<ParcelDetails>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const router = useRouter();

  const onApplyCode: MouseEventHandler = async (e) => {
    e.preventDefault();
    const parcelResponse = await getOneByCode(code);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      setError(problem.detail);
      return;
    }

    const fetchedParcel = (await parcelResponse.json()) as ParcelDetails;
    setParcel(fetchedParcel);
    setError(undefined);
  };

  const onConfirm: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (error || !parcel) return;
    const response = await submit(code, id, parcel.version);
    if (response.status !== StatusCodes.OK) {
      const problem = await response.json() as Problem;
      setError(problem.detail);
      return;
    }

    const { lockerNumber } = await response.json() as SubmitResponse;

    setLockerNumber(lockerNumber);
    setError(undefined);
  };

  const onSubmit: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (error) return;

    await router.push(`/terminal/${id}`);
  };

  return (
    <form>
      <FormInput
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      />
      {parcel ? JSON.stringify(parcel) : null}
      <button onClick={onApplyCode}>Apply code</button>
      {parcel ? <button onClick={onConfirm}>Confirm</button> : null}
      {lockerNumber ? (
        <button onClick={onSubmit}>Close locker {lockerNumber}</button>
      ) : null}
      {error}
    </form>
  );
}
