import random

from server import ServerClient
from config import config


def test_scenario():
    server = ServerClient(config.server_url)

    response = server.register_terminal(default_terminal("Druskio g. 5"))
    response.raise_for_status()
    from_terminal_id = response.json()['id']

    response = server.register_terminal(default_terminal("Giluzės g. 5"))
    response.raise_for_status()
    to_terminal_id = response.json()['id']

    courier_registration = default_courier()
    response = server.register_courier(courier_registration)
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
    assert len(get_parcels(terminal)) == 1 and get_parcels(terminal)[0] == parcel_id

    response = server.courier_authenticate(courier_registration)
    response.raise_for_status()

    token = response.json()['token']

    response = server.ship_parcel(parcel_code, courier_id, parcel_version + 1, token)
    print(response.json())
    response.raise_for_status()

    response = server.get_courier(courier_id)
    response.raise_for_status()
    courier = response.json()
    assert len(courier['parcelIds']) == 1

    response = server.get_terminal(from_terminal_id)
    response.raise_for_status()
    terminal = response.json()
    assert len(get_parcels(terminal)) == 0

    response = server.deliver_parcel(parcel_code, to_terminal_id, parcel_version + 2, token)
    response.raise_for_status()

    response = server.get_courier(courier_id)
    response.raise_for_status()
    courier = response.json()
    assert len(courier['parcelIds']) == 0

    response = server.get_terminal(to_terminal_id)
    response.raise_for_status()
    terminal = response.json()
    assert len(get_parcels(terminal)) == 1

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
    assert len(get_parcels(terminal)) == 0


def default_headers(version: int):
    return {"Content-type": "application/json", "If-Match": f'''"{version}"'''}

def get_parcels(terminal):
    return [locker['parcelId'] for locker in terminal['lockers'] if locker['parcelId'] is not None]

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
    return {"name": f"Edvin Sinkevič {random.randint(1, 1000)}", "password": "HelloThere"}


def default_terminal(address: str):
    return {"address": address, "lockers":  [ { "size": "S", "count": 10 }, { "size": "M", "count": 10 }, { "size": "L", "count": 10}]}