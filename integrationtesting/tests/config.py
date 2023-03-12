import os
from dataclasses import dataclass


@dataclass
class Config:
    client_url: str
    server_url: str


config: Config = Config(
    client_url=os.environ.get("COLORBLIND_CLIENT_URL"),
    server_url=os.environ.get("COLORBLIND_SERVER_URL")
)
