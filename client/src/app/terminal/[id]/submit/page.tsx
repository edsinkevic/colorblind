"use client";
import { MouseEventHandler, useState } from "react";
import { FormInput } from "colorblind/shared/components/FormInput";
import { detailsGetOne, submit } from "colorblind/shared/requests/parcels";
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

export default function TerminalSubmit({ params: { id } }: Props) {
  const [error, setError] = useState<string>();
  const [code, setCode] = useState<string>("");
  const [parcel, setParcel] = useState<ParcelDetails>();
  const [parcelVersion, setParcelVersion] = useState<string>();
  const [lockerNumber, setLockerNumber] = useState<number>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const router = useRouter();

  const onApplyCode: MouseEventHandler = async (e) => {
    e.preventDefault();
    const parcelResponse = await detailsGetOne(code);
    if (parcelResponse.status !== StatusCodes.OK) {
      const problem = (await parcelResponse.json()) as Problem;
      setError(problem.detail);
      return;
    }

    const version = parcelResponse.headers.get("ETag");

    if (!version) {
      setError("Couldn't get parcel version");
      return;
    }
    const fetchedParcel = (await parcelResponse.json()) as ParcelDetails;

    if (fetchedParcel.status !== ParcelStatus.REGISTERED) {
      setError("Parcel must have registered status!");
      return;
    }

    setParcelVersion(version);
    setParcel(fetchedParcel);
    setError(undefined);
  };

  const onLockerOpen: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!parcel || error) return;

    setLockerNumber(Math.floor(Math.random() * 20));
  };

  const onSubmit: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!parcelVersion || error) return;

    const response = await submit(code, id, parcelVersion);
    if (response.status !== StatusCodes.OK) {
      const problem = (await response.json()) as Problem;
      setError(problem.detail);
      return;
    }

    setError(undefined);
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
      {parcel ? <button onClick={onLockerOpen}>Open locker</button> : null}
      {lockerNumber ? (
        <button onClick={onSubmit}>Close locker {lockerNumber}</button>
      ) : null}
      {successMessage}
      {error}
    </form>
  );
}
