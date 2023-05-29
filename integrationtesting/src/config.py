from dataclasses import dataclass


@dataclass
class Config:
    client_url: str
    server_url: str


config: Config = Config(
    client_url="http://localhost:8080",
    server_url="http://localhost:8080/api/"
)
