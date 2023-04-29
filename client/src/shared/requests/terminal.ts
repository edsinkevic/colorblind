import { RegisterTerminal } from "colorblind/shared/lib/models/models";
import {
  colorblindServerUrl,
  defaultFetchConfig,
} from "colorblind/shared/requests/shared";

export const register = (data: RegisterTerminal): Promise<Response> =>
  fetch(colorblindServerUrl(`/terminals`), {
    ...defaultFetchConfig,
    body: JSON.stringify(data),
    method: "POST",
  });
