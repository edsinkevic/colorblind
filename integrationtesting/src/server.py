from typing import Optional

import requests


class ServerClient:
    url: str

    def __init__(self, url: str):
        self.url = url

    def get_parcel(self, _id: str):
        return requests.get(f"{self.url}/parcels/{_id}", headers=default_headers())

    def get_parcel_by_code(self, _code: str):
        return requests.get(f"{self.url}/parcels/code/{_code}", headers=default_headers())

    def register_parcel(self, _obj: dict):
        return requests.post(f"{self.url}/parcels/register", headers=default_headers(), json=_obj)

    def submit_parcel_to_terminal(self, _code: str, _terminal_id: str, version: int):
        return requests.post(f"{self.url}/parcels/{_code}/submit/terminal/{_terminal_id}",
                             headers=default_headers(version))

    def ship_parcel(self, _code: str, _courier_id: str, version: int, auth: str):
        return requests.post(f"{self.url}/parcels/{_code}/ship", headers=default_headers(version, auth))

    def deliver_parcel(self, _code: str, _terminal_id: str, version: int, auth):
        return requests.post(f"{self.url}/parcels/{_code}/deliver/terminal/{_terminal_id}",
                             headers=default_headers(version, auth))

    def receive_parcel(self, _code: str, version: int):
        return requests.post(f"{self.url}/parcels/{_code}/receive",
                             headers=default_headers(version))

    def register_terminal(self, _obj: dict):
        return requests.post(f"{self.url}/terminals", json=_obj,
                             headers=default_headers())

    def register_courier(self, _obj: dict):
        return requests.post(f"{self.url}/couriers/register", json=_obj,
                             headers=default_headers())

    def get_courier(self, _id: str):
        return requests.get(f"{self.url}/couriers/{_id}", headers=default_headers())

    def get_terminal(self, _id: str):
        return requests.get(f"{self.url}/terminals/{_id}", headers=default_headers())

    def courier_authenticate(self, _obj: dict):
        return requests.post(f"{self.url}/couriers/authenticate", json=_obj, headers=default_headers())


def default_headers(version: Optional[int] = None, auth: Optional[str] = None):
    headers = {"Content-type": "application/json"}
    if version is not None:
        headers["If-Match"] = f'''"{version}"'''

    if auth is not None:
        headers["Authorization"] = auth

    return headers
