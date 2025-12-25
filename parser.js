const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'https://kakoysegodnyaprazdnik.ru/';

(async () => {
  console.log(`🚀 Запускаем браузер и идем на ${URL}...`);

  const browser = await puppeteer.launch({
    headless: "new", // Запуск без окна (для сервера)
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Нужны для GitHub Actions
  });

  const page = await browser.newPage();

  // Маскируемся под обычного пользователя
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Устанавливаем размер экрана как у ноутбука
  await page.setViewport({ width: 1366, height: 768 });

  try {
    // Переходим на сайт и ждем, пока загрузится контент (networkidle2 означает "почти нет сетевой активности")
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Site loaded. Looking for content...');

    // Парсим данные прямо в контексте браузера
    const result = await page.evaluate(() => {
      // Эта функция выполняется ВНУТРИ браузера на странице сайта
      
      // 1. Ищем дату
      const dateEl = document.querySelector('h2.mainpage');
      const dateText = dateEl ? dateEl.innerText.trim() : 'Сегодня';

      // 2. Ищем праздники
      // На этом сайте праздники лежат в div.listing_wr -> span[itemprop="text"]
      const holidays = [];
      const elements = document.querySelectorAll('div.listing_wr span[itemprop="text"]');

      elements.forEach(el => {
        const text = el.innerText.trim();
        if (text && text.length > 3) {
          holidays.push(text);
        }
      });

      return {
        date: dateText,
        holidays: holidays
      };
    });

    console.log(`✅ Успешно! Дата: ${result.date}`);
    console.log(`Найдено праздников: ${result.holidays.length}`);

    // Сохраняем в файл
    fs.writeFileSync('data.json', JSON.stringify(result, null, 4));
    console.log('Файл data.json сохранен.');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    
    // Если ошибка, сделаем скриншот, чтобы понять, что увидел робот (полезно для отладки)
    // await page.screenshot({ path: 'error.png' });
    
  } finally {
    await browser.close();
  }
})();