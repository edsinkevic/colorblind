import {
  colorblindServerUrl,
  defaultFetchConfig,
} from "colorblind/shared/requests/shared";
import { RegisterCourier } from "colorblind/shared/lib/models/models";

export const query = (name: string | undefined): Promise<Response> => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  return fetch(colorblindServerUrl(`/couriers?${params}`), {
    ...defaultFetchConfig,
    method: "GET",
    next: { revalidate: 2 },
  });
};

export const fetchCourier = (id: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/couriers/${id}`), {
    ...defaultFetchConfig,
    method: "GET",
  });
export const register = (data: RegisterCourier): Promise<Response> =>
  fetch(colorblindServerUrl(`/couriers`), {
    ...defaultFetchConfig,
    body: JSON.stringify(data),
    method: "POST",
  });
