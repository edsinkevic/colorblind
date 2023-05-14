import {
  colorblindServerUrl,
  defaultFetchConfig,
} from "colorblind/shared/requests/shared";

export const query = (name: string | undefined): Promise<Response> => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  return fetch(colorblindServerUrl(`/couriers?${params}`), {
    ...defaultFetchConfig,
    method: "GET",
  });
};

export const fetchCourier = (id: string): Promise<Response> =>
  fetch(colorblindServerUrl(`/couriers/${id}`), {
    ...defaultFetchConfig,
    method: "GET",
  });
