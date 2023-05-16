import json
from pprint import pprint

import requests as requests
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
import os
from dataclasses import dataclass

from selenium.webdriver.common.by import By


@dataclass
class Config:
    client_url: str
    server_url: str


config: Config = Config(
    client_url="http://localhost:3000",
    server_url="http://localhost:8080"
)


def test_scenario():
    from_terminal = default_terminal("Druskio g. 5")
    response = requests.post(f"{config.server_url}/terminals/", json=from_terminal,
                             headers={"Content-type": "application/json"})
    response.raise_for_status()
    from_terminal_id = response.json()['id']

    to_terminal = default_terminal("Giluzės g. 5")
    response = requests.post(f"{config.server_url}/terminals/", json=to_terminal,
                             headers={"Content-type": "application/json"})
    response.raise_for_status()
    to_terminal_id = response.json()['id']

    response = requests.post(f"{config.server_url}/couriers", json=default_courier(),
                             headers={"Content-type": "application/json"})
    response.raise_for_status()

    resp = response.json()
    courier_id = resp['id']

    response = requests.post(f"{config.server_url}/parcels/register",
                             json=default_registration(from_terminal_id, to_terminal_id),
                             headers={"Content-type": "application/json"})
    response.raise_for_status()
    resp = response.json()
    parcel_id = resp['id']

    response = requests.get(f"{config.server_url}/parcels/{parcel_id}", headers={"Content-type": "application/json"})
    response.raise_for_status()
    resp = response.json()
    parcel_code = resp['code']

    response = requests.post(f"{config.server_url}/parcels/{parcel_code}/submit/terminal/{from_terminal_id}",
                             headers=default_headers(1))
    response.raise_for_status()

    response = requests.get(f"{config.server_url}/terminals/{from_terminal_id}")
    response.raise_for_status()

    terminal = response.json()

    assert len(terminal['parcelIds']) == 1 and terminal['parcelIds'][0] == parcel_id

    response = requests.post(f"{config.server_url}/parcels/{parcel_code}/ship/{courier_id}", headers=default_headers(2))
    response.raise_for_status()

    response = requests.post(f"{config.server_url}/parcels/{parcel_code}/deliver/terminal/{to_terminal_id}",
                             headers=default_headers(3))
    response.raise_for_status()

    response = requests.get(f"{config.server_url}/parcels/code/{parcel_code}")
    resp = response.json()

    assert resp['status'] == "Delivered"


def default_headers(version: int):
    return {"Content-type": "application/json", "If-Match": f'''"{version}"'''}


def default_registration(from_terminal, to_terminal):
    return {"size": "S", "couponCode": "123", "transactionCode": "123",
            "senderDeliveryInfo": {"email": "vardas@pavardaitis.com", "phoneNumber": "+37061095511",
                                   "fullname": "Vardas Pavardaitis", "terminalId": from_terminal,
                                   "takeawayAddress": ""},
            "receiverDeliveryInfo": {"email": "vardas@pavardaitis.com", "phoneNumber": "+37061095511",
                                     "fullname": "Vardas Pavardaitis", "terminalId": to_terminal,
                                     "takeawayAddress": ""}, "invoiceEmail": "vardas@pavardaitis",
            "deliveryType": {"from": "terminal", "to": "terminal"}}


def default_courier():
    return {"name": "Edvin Sinkevič"}


def default_terminal(address: str):
    return {"address": address}
