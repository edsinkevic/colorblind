import {
  Problem,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getAll } from "colorblind/shared/requests/terminal";
import StepTwoClient from "colorblind/app/registerparcel/steptwo/components/page-client";

export default async function StepTwo() {
  const response = await getAll();

  if (response.status !== StatusCodes.OK) {
    const problem = (await response.json()) as Problem;
    throw new Error(problem.detail);
  }

  const terminals = (await response.json()) as TerminalDetails[];

  return <StepTwoClient terminals={terminals} />;
}
