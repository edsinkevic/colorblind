from dataclasses import dataclass

from server import ServerClient


@dataclass
class Config:
    client_url: str
    server_url: str


config: Config = Config(
    client_url="http://localhost:3000",
    server_url="http://localhost:8080"
)


def test_scenario():
    server = ServerClient(config.server_url)

    response = server.register_terminal(default_terminal("Druskio g. 5"))
    response.raise_for_status()
    from_terminal_id = response.json()['id']

    response = server.register_terminal(default_terminal("Giluzės g. 5"))
    response.raise_for_status()
    to_terminal_id = response.json()['id']

    response = server.register_courier(default_courier())
    response.raise_for_status()
    resp = response.json()
    courier_id = resp['id']

    response = server.register_parcel(default_registration(from_terminal_id, to_terminal_id))
    response.raise_for_status()
    resp = response.json()
    parcel_id = resp['id']

    response = server.get_parcel(parcel_id)
    response.raise_for_status()
    resp = response.json()
    parcel_code = resp['code']
    parcel_version = resp['version']

    response = server.submit_parcel_to_terminal(parcel_code, from_terminal_id, parcel_version)
    response.raise_for_status()

    response = server.get_terminal(from_terminal_id)
    response.raise_for_status()
    terminal = response.json()
    assert len(terminal['parcelIds']) == 1 and terminal['parcelIds'][0] == parcel_id

    response = server.ship_parcel(parcel_code, courier_id, parcel_version + 1)
    response.raise_for_status()

    response = server.get_courier(courier_id)
    response.raise_for_status()
    courier = response.json()
    assert len(courier['parcelIds']) == 1

    response = server.get_terminal(from_terminal_id)
    response.raise_for_status()
    terminal = response.json()
    assert len(terminal['parcelIds']) == 0

    response = server.deliver_parcel(parcel_code, to_terminal_id, parcel_version + 2)
    response.raise_for_status()

    response = server.get_courier(courier_id)
    response.raise_for_status()
    courier = response.json()
    assert len(courier['parcelIds']) == 0

    response = server.get_terminal(to_terminal_id)
    response.raise_for_status()
    terminal = response.json()
    assert len(terminal['parcelIds']) == 1

    response = server.get_parcel_by_code(parcel_code)
    response.raise_for_status()
    resp = response.json()
    assert resp['status'] == "Delivered"

    response = server.receive_parcel(parcel_code, parcel_version + 3)
    response.raise_for_status()

    response = server.get_parcel(parcel_id)
    response.raise_for_status()
    resp = response.json()
    assert resp['status'] == "Received"

    response = server.get_terminal(to_terminal_id)
    response.raise_for_status()
    terminal = response.json()
    assert len(terminal['parcelIds']) == 0


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
