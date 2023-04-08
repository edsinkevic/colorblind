import time

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


def test_register_parcel():
    options = webdriver.ChromeOptions()
    #  options.headless = True
    driver: WebDriver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    driver.get(config.client_url)
    element = driver.find_element(By.XPATH, "//button[contains(text(), 'Send package')]")
    element.click()

    time.sleep(0.5)
    element = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
    element.click()

    time.sleep(0.5)
    element = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
    element.click()
    time.sleep(0.5)

    parcel_code = driver.current_url.rsplit('/', 1)[-1]

    response = requests.get(f"{config.server_url}/parcels/{parcel_code}")
    response.raise_for_status()
