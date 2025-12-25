import requests
from bs4 import BeautifulSoup
import json
import datetime
import os

def parse_holidays():
    url = "https://kakoysegodnyaprazdnik.ru/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.encoding = 'utf-8' 
        
        soup = BeautifulSoup(response.text, 'html.parser')

        date_element = soup.find('h2', class_='mainpage')
        if date_element:
            parsed_date = date_element.get_text(strip=True)
        else:
            parsed_date = "Дата не определена"
        
        listing = soup.find('div', class_='listing_wr')
        
        holidays_list = []

        if listing:
            # внутри списка ищем ВСЕ span с атрибутом itemprop="text"
            elements = listing.find_all('span', itemprop='text')
            
            for el in elements:
                text = el.get_text(strip=True)
                if text:
                    holidays_list.append(text)
        
        print(f"Найдено праздников: {len(holidays_list)}")

        # 3. Формируем данные
        data = {
            "date": parsed_date,
            "holidays": holidays_list 
        }

        # 4. Сохраняем в файл data.json
        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    except Exception as e:
        print(f"Ошибка парсинга: {e}")

if __name__ == "__main__":
    parse_holidays()