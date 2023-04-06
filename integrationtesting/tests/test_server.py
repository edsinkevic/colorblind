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
    response = requests.post(f"{config.server_url}/parcels/register", json=json.loads(defaultRegistration()),
                             headers={"Content-type": "application/json"})
    parcel_code = response.text

    response = requests.post(f"{config.server_url}/parcels/{parcel_code}/submit/terminal/123", headers=defaultHeaders(1))
    pprint(response.text)
    response.raise_for_status()

    response = requests.post(f"{config.server_url}/parcels/{parcel_code}/ship/123", headers=defaultHeaders(2))
    response.raise_for_status()

    response = requests.post(f"{config.server_url}/parcels/{parcel_code}/deliver", headers=defaultHeaders(3))
    response.raise_for_status()

    response = requests.get(f"{config.server_url}/parcels/{parcel_code}")
    resp = response.json()

    assert resp[0]['status'] == "Delivered"

def defaultHeaders(version: int):
    return {"Content-type": "application/json", "If-Match": f'''"{version}"'''}


def defaultRegistration():
    return '''{"size": "S", "couponCode": "123", "transactionCode": "123",
           "senderDeliveryInfo": {"email": "vardas@pavardaitis.com", "phoneNumber": "+37061095511",
                                  "fullname": "Vardas Pavardaitis", "parcelLockerAddress": "Druskio g.5",
                                  "takeawayAddress": ""},
           "receiverDeliveryInfo": {"email": "vardas@pavardaitis.com", "phoneNumber": "+37061095511",
                                    "fullname": "Vardas Pavardaitis", "parcelLockerAddress": "Druskio g.5",
                                    "takeawayAddress": ""}, "invoiceEmail": "vardas@pavardaitis",
           "deliveryType": {"from": "terminal", "to": "terminal"}}'''
