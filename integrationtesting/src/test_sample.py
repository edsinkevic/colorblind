import time
from dataclasses import dataclass

from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
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
    driver: WebDriver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    driver.get(config.client_url)
    element = driver.find_element(By.XPATH, "//button[contains(text(), 'Send package')]")
    element.click()

    time.sleep(0.5)
    element = driver.find_element(By.XPATH, "//button[contains(text(), 'Next')]")
    element.click()

    time.sleep(0.5)
    element = driver.find_element(By.XPATH, "//button[contains(text(), 'Next')]")
    element.click()
