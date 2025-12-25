// Используем версию с плагинами
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Включаем режим невидимки
puppeteer.use(StealthPlugin());

const URL = 'https://kakoysegodnyaprazdnik.ru/';

(async () => {
  console.log(`🚀 (Stealth Mode) Запускаем браузер и идем на ${URL}...`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Размер экрана обычного ноутбука
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Увеличиваем таймаут до 60 секунд (на случай долгой проверки Cloudflare)
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('Page opened. Waiting for selector .listing_wr...');

    // САМОЕ ВАЖНОЕ: Ждем, пока на экране появится ИМЕННО СПИСОК праздников.
    // Если висит "Проверка браузера", робот будет ждать до победного (или до ошибки).
    try {
        await page.waitForSelector('div.listing_wr', { timeout: 15000 });
        console.log('Selector found! Parsing...');
    } catch (e) {
        console.log('⚠️ Селектор не появился вовремя. Возможно, защита.');
    }

    // Делаем скриншот для отладки (сохранится на сервере GitHub)
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('📸 Скриншот сохранен как debug-screenshot.png');

    // Парсим
    const result = await page.evaluate(() => {
      const dateEl = document.querySelector('h2.mainpage');
      const dateText = dateEl ? dateEl.innerText.trim() : 'Сегодня';

      const holidays = [];
      // Ищем span внутри listing_wr
      const elements = document.querySelectorAll('div.listing_wr span[itemprop="text"]');

      elements.forEach(el => {
        const text = el.innerText.trim();
        // Фильтр мусора
        if (text && text.length > 3) {
          holidays.push(text);
        }
      });

      return {
        date: dateText,
        holidays: holidays
      };
    });

    console.log(`✅ Дата: ${result.date}`);
    console.log(`🎉 Найдено праздников: ${result.holidays.length}`);

    // Если праздников 0 - это подозрительно, но файл сохраним
    fs.writeFileSync('data.json', JSON.stringify(result, null, 4));
    console.log('Файл data.json сохранен.');

  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
  } finally {
    await browser.close();
  }
})();