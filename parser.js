
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const URL = 'https://kakoj-segodnja-prazdnik.com/';

(async () => {
  console.log(`🚀 Заходим на ${URL}...`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
        '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('Страница загружена. Ждем структуру...');

    // --- ЖДЕМ СТРУКТУРУ (КЛАССЫ С СКРИНШОТА) ---
    // Ждем появления блока items-leading, в котором лежит весь список
    await page.waitForSelector('table.art-article', { timeout: 60000 });

    // Сразу делаем скриншот, раз структура прогрузилась
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

    const result = await page.evaluate(() => {
      // Дата
      let dateText = 'я кажется сломался и не знаю какая сегодня дата..';
      const dateEl = document.querySelector('table.art-article td[colspan="2"] strong')
      if (dateEl) {
          dateText = dateEl.innerText.trim();
      }

      const holidaysSet = new Set();
      const selector = 'table.art-article td:not([colspan]) span:not([style*="medium"])';
      const nodes = document.querySelectorAll(selector);

      nodes.forEach(el => {
        const text = el.innerText.trim();
        
        // Легкая чистка от пустых строк и явного мусора
        // (Условие про скобки оставляю на всякий случай, если вдруг где-то нет стилей)
        if (text.length > 2 && 
            !text.includes('Праздники') && 
            !text.includes('Календарь') &&
            !(text.startsWith('(') && text.endsWith(')'))) {
            holidaysSet.add(text);
        }
      });

      return {
        date: dateText,
        holidays: Array.from(holidaysSet)
      };
    });

    console.log(`Дата: ${result.date}`);
    console.log(`Найдено записей: ${result.holidays.length}`);

    fs.writeFileSync('data.json', JSON.stringify(result, null, 4));
    console.log('data.json записан.');

  } catch (error) {
    console.error('Ошибка:', error.message);
    try { await page.screenshot({ path: 'debug-screenshot.png', fullPage: true }); } catch (e) {}
  } finally {
    await browser.close();
  }
})();