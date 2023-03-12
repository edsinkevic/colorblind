from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver

from config import config


def test_sample():
    driver: WebDriver = webdriver.Chrome()
    driver.get(config.client_url)
