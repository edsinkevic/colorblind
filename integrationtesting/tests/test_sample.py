import requests as requests
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By

from tests.config import config


def test_scenario():
    options = webdriver.ChromeOptions()
    options.headless = True
    driver: WebDriver = webdriver.Chrome(options=options)
    driver.get(config.client_url)
    driver.find_element(By.XPATH, "//*[contains(text(), 'FastMail')]")

    response = requests.get(f"{config.server_url}/parcels/1")
    response.raise_for_status()

    driver.close()
