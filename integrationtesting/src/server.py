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

    def ship_parcel(self, _code: str, _courier_id: str, version: int, _locker_number: int):
        return requests.post(f"{self.url}/parcels/{_code}/ship/{_courier_id}/{_locker_number}", headers=default_headers(version))

    def deliver_parcel(self, _code: str, _terminal_id: str, version: int):
        return requests.post(f"{self.url}/parcels/{_code}/deliver/terminal/{_terminal_id}",
                             headers=default_headers(version))

    def receive_parcel(self, _code: str, version: int, _locker_number: int):
        return requests.post(f"{self.url}/parcels/{_code}/receive/{_locker_number}",
                             headers=default_headers(version))

    def register_terminal(self, _obj: dict):
        return requests.post(f"{self.url}/terminals", json=_obj,
                             headers=default_headers())

    def register_courier(self, _obj: dict):
        return requests.post(f"{self.url}/couriers", json=_obj,
                             headers=default_headers())

    def get_courier(self, _id: dict):
        return requests.get(f"{self.url}/couriers/{_id}", headers=default_headers())

    def get_terminal(self, _id: dict):
        return requests.get(f"{self.url}/terminals/{_id}", headers=default_headers())


def default_headers(version: Optional[int] = None):
    if version is not None:
        return {"Content-type": "application/json", "If-Match": f'''"{version}"'''}

    return {"Content-type": "application/json"}
