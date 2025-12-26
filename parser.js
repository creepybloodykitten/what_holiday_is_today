// // Используем версию с плагинами
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const fs = require('fs');

// // Включаем режим невидимки
// puppeteer.use(StealthPlugin());

// const URL = 'https://kakoysegodnyaprazdnik.ru/';

// (async () => {
//   console.log(`🚀 (Stealth Mode) Запускаем браузер и идем на ${URL}...`);

//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });

//   const page = await browser.newPage();

//   // Размер экрана обычного ноутбука
//   await page.setViewport({ width: 1920, height: 1080 });

//   try {
//     // Увеличиваем таймаут до 60 секунд (на случай долгой проверки Cloudflare)
//     await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

//     console.log('Page opened. Waiting for selector .listing_wr...');

//     // САМОЕ ВАЖНОЕ: Ждем, пока на экране появится ИМЕННО СПИСОК праздников.
//     // Если висит "Проверка браузера", робот будет ждать до победного (или до ошибки).
//     try {
//         await page.waitForSelector('div.listing_wr', { timeout: 15000 });
//         console.log('Selector found! Parsing...');
//     } catch (e) {
//         console.log('⚠️ Селектор не появился вовремя. Возможно, защита.');
//     }

//     // Делаем скриншот для отладки (сохранится на сервере GitHub)
//     await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
//     console.log('📸 Скриншот сохранен как debug-screenshot.png');

//     // Парсим
//     const result = await page.evaluate(() => {
//       const dateEl = document.querySelector('h2.mainpage');
//       const dateText = dateEl ? dateEl.innerText.trim() : 'Сегодня';

//       const holidays = [];
//       // Ищем span внутри listing_wr
//       const elements = document.querySelectorAll('div.listing_wr span[itemprop="text"]');

//       elements.forEach(el => {
//         const text = el.innerText.trim();
//         // Фильтр мусора
//         if (text && text.length > 3) {
//           holidays.push(text);
//         }
//       });

//       return {
//         date: dateText,
//         holidays: holidays
//       };
//     });

//     console.log(`✅ Дата: ${result.date}`);
//     console.log(`🎉 Найдено праздников: ${result.holidays.length}`);

//     // Если праздников 0 - это подозрительно, но файл сохраним
//     fs.writeFileSync('data.json', JSON.stringify(result, null, 4));
//     console.log('Файл data.json сохранен.');

//   } catch (error) {
//     console.error('❌ Критическая ошибка:', error.message);
//   } finally {
//     await browser.close();
//   }
// })();




// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const fs = require('fs');

// puppeteer.use(StealthPlugin());

// const URL = 'https://kakoj-segodnja-prazdnik.com/';

// (async () => {
//   console.log(`🚀 Пробуем пробиться на зеркало: ${URL}...`);

//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: [
//         '--no-sandbox', 
//         '--disable-setuid-sandbox',
//         '--window-size=1920,1080'
//     ]
//   });

//   const page = await browser.newPage();
//   await page.setViewport({ width: 1920, height: 1080 });

//   try {
//     // Ставим большой таймаут, так как Cloudflare может "думать" секунд 10
//     await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

//     console.log('Страница загружена. Делаю контрольный снимок...');
    
//     // 1. ДЕЛАЕМ СНИМОК СРАЗУ (чтобы видеть, забанили или нет)
//     await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
//     console.log('📸 Снимок сохранен!');

//     // 2. ПАРСИМ
//     const result = await page.evaluate(() => {
//       // На .com версии структура другая. Праздники обычно в блоке .main или .content
//       const holidays = [];
//       const dateText = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : 'Сегодня';

//       // Попробуем найти элементы списка с классом event (часто бывает на этом шаблоне)
//       let elements = document.querySelectorAll('.event');
      
//       // Если .event нет, ищем просто лишки внутри .content
//       if (elements.length === 0) {
//           elements = document.querySelectorAll('.content li');
//       }
      
//       // Если и так пусто, попробуем найти текст с точками внутри .main
//       if (elements.length === 0) {
//           const mainBlock = document.querySelector('.main');
//           if (mainBlock) {
//              // Грубый парсинг текста по строкам
//              const lines = mainBlock.innerText.split('\n');
//              return {
//                  date: dateText,
//                  holidays: lines.filter(l => l.includes('•') || l.length > 5).slice(0, 20) // Вернем сырые строки для проверки
//              };
//           }
//       }

//       elements.forEach(el => {
//         const text = el.innerText.trim();
//         if (text && text.length > 3) {
//           holidays.push(text);
//         }
//       });

//       return {
//         date: dateText,
//         holidays: holidays
//       };
//     });

//     console.log(`✅ Дата (из H1): ${result.date}`);
//     console.log(`🎉 Найдено строк: ${result.holidays.length}`);

//     // Сохраняем даже если пусто (чтобы не ломать скрипт), но скриншот нам скажет правду
//     fs.writeFileSync('data.json', JSON.stringify(result, null, 4));
//     console.log('Файл data.json сохранен.');

//   } catch (error) {
//     console.error('❌ Ошибка:', error.message);
//     // Если упали с ошибкой (например timeout), тоже делаем скрин
//     await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
//   } finally {
//     await browser.close();
//   }
// })();







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
    await page.waitForSelector('.items-leading', { timeout: 60000 });
    
    console.log('✅ Структура (.items-leading) найдена! Снимаю и паршу.');

    // Сразу делаем скриншот, раз структура прогрузилась
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

    const result = await page.evaluate(() => {
      // 1. Дата
      // Ищем заголовок H1 или текст вверху
      let dateText = 'Сегодня';
      const h1 = document.querySelector('h1');
      // Часто дата лежит в div.art-postheader или просто в заголовке
      if (h1) dateText = h1.innerText.replace('Праздники сегодня', '').trim();

      const holidays = [];
      
      // 2. Праздники
      // Мы берем контейнер items-leading и ищем внутри него все art-post
      // Внутри art-post лежат таблицы, и где-то в span текст
      
      // Самый надежный способ для такой верстки:
      // Найти все span внутри .items-leading, которые содержат текст
      const container = document.querySelector('.items-leading');
      if (container) {
          const spans = container.querySelectorAll('span');
          
          spans.forEach(span => {
              let text = span.innerText.trim();
              
              // Фильтрация мусора
              if (text.length > 5 && 
                  !text.includes('Праздники сегодня') && 
                  !text.includes('Календарь') &&
                  !text.match(/^\d+$/)) { // Исключаем просто цифры
                  
                  // Убираем дубликаты
                  if (!holidays.includes(text)) {
                      holidays.push(text);
                  }
              }
          });
      }

      return {
        date: dateText,
        holidays: holidays
      };
    });

    console.log(`Дата: ${result.date}`);
    console.log(`Найдено записей: ${result.holidays.length}`);

    fs.writeFileSync('data.json', JSON.stringify(result, null, 4));
    console.log('data.json записан.');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    try { await page.screenshot({ path: 'debug-screenshot.png', fullPage: true }); } catch (e) {}
  } finally {
    await browser.close();
  }
})();