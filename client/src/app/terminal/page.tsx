import React from "react";
import {
  Problem,
  StatusCodes,
  TerminalDetails,
} from "colorblind/shared/lib/models/models";
import { getAll } from "colorblind/shared/requests/terminal";
import PickTerminalClient from "colorblind/app/terminal/components/page-client";

export default async function PickTerminal() {
  if (process.env.BUILD_ENVIRONMENT === "local") {
    return null;
  }

  const response = await getAll();

  if (response.status !== StatusCodes.OK) {
    const problem = (await response.json()) as Problem;
    throw new Error(problem.detail);
  }

  const terminals = (await response.json()) as TerminalDetails[];

  return <PickTerminalClient terminals={terminals} />;
}
