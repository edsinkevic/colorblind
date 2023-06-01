import {
  colorblindServerUrl,
  defaultFetchConfig,
} from "colorblind/shared/requests/shared";
import {
  AuthenticateRequest,
  RegisterCourier,
} from "colorblind/shared/lib/models/models";

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
  fetch(colorblindServerUrl(`/couriers/register`), {
    ...defaultFetchConfig,
    body: JSON.stringify(data),
    method: "POST",
  });

export const listUnapproved = (
  pageNum: number = 1,
  pageSize: number = 10
): Promise<Response> =>
  fetch(
    colorblindServerUrl(
      `/admin/unapproved?` +
        new URLSearchParams({
          pageNum: pageNum.toString(),
          pageSize: pageSize.toString(),
        }).toString()
    ),
    {
      ...defaultFetchConfig,
      method: "GET",
    }
  );

export const approve = (id: string, version: number): Promise<Response> =>
  fetch(colorblindServerUrl(`/admin/${id}/approve`), {
    ...defaultFetchConfig,
    headers: {
      ...defaultFetchConfig.headers,
      "If-Match": `"${version.toString()}"`,
    },
    method: "POST",
  });

export const authenticate = (data: AuthenticateRequest): Promise<Response> =>
  fetch(colorblindServerUrl(`/couriers/authenticate`), {
    ...defaultFetchConfig,
    body: JSON.stringify(data),
    method: "POST",
  });
