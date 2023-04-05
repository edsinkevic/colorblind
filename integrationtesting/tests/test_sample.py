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
    options = webdriver.ChromeOptions()
    options.headless = True
    driver: WebDriver = webdriver.Chrome(options=options)
    driver.get(config.client_url)
    driver.find_element(By.XPATH, "//*[contains(text(), 'Terminal')]")

    response = requests.get(f"{config.server_url}/parcels/1")
    response.raise_for_status()

    assert response.json().get('parcel', None) is not None

    driver.close()
