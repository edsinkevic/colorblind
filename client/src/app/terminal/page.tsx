import React from "react";
import {
  Problem,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getAll } from "colorblind/shared/requests/terminal";
import StepOneClient from "colorblind/app/terminal/components/page-client";

export default async function StepOne() {
  const response = await getAll();

  if (response.status !== StatusCodes.OK) {
    const problem = (await response.json()) as Problem;
    throw new Error(problem.detail);
  }

  const terminals = (await response.json()) as TerminalDetails[];

  return <StepOneClient terminals={terminals} />;
}
