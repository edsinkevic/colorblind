"use client";
import { useState } from "react";
import { FormInput } from "colorblind/shared/components/FormInput";
import { detailsGetOne, submit } from "colorblind/shared/requests/parcels";
import { Problem, StatusCodes } from "colorblind/shared/lib/models/models";
import { useRouter } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function TerminalSubmit({ params: { id } }: Props) {
  const [error, setError] = useState<string>();
  const [code, setCode] = useState<string>("");
  const router = useRouter();

  return (
    <form
      onSubmit={async (e) => {
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

        const response = await submit(code, id, version);
        if (response.status !== StatusCodes.OK) {
          const problem = (await response.json()) as Problem;
          setError(problem.detail);
          return;
        }

        setError(undefined);
        await router.push(`/terminal/${id}`);
      }}
    >
      <FormInput
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      />
      <button type="submit">Submit</button>
      {error}
    </form>
  );
}
