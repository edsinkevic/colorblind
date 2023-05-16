import time
from dataclasses import dataclass
from config import config

from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By



def test_register_parcel():
    options = webdriver.ChromeOptions()
    options.headless = True
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
