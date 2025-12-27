
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const fs = require('fs');

// puppeteer.use(StealthPlugin());

// const URL = 'https://kakoj-segodnja-prazdnik.com/';

// (async () => {
//   console.log(`🚀 Заходим на ${URL}...`);

//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: [
//         '--no-sandbox', 
//         '--disable-setuid-sandbox',
//         '--window-size=1920,1080',
//         '--disable-blink-features=AutomationControlled'
//     ]
//   });

//   const page = await browser.newPage();
//   await page.setViewport({ width: 1920, height: 1080 });

//   try {
//     await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
//     console.log('Страница загружена. Ждем структуру...');

//     // --- ЖДЕМ СТРУКТУРУ (КЛАССЫ С СКРИНШОТА) ---
//     // Ждем появления блока items-leading, в котором лежит весь список
//     await page.waitForSelector('table.art-article', { timeout: 60000 });

//     // Сразу делаем скриншот, раз структура прогрузилась
//     await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

//     const result = await page.evaluate(() => {
//       // Дата
//       let dateText = 'я кажется сломался и не знаю какая сегодня дата..';
//       const dateEl = document.querySelector('table.art-article td[colspan="2"] strong')
//       if (dateEl) {
//           dateText = dateEl.innerText.trim();
//       }

//       const holidaysSet = new Set();
//       const selector = 'table.art-article td:not([colspan]) span:not([style*="medium"])';
//       const nodes = document.querySelectorAll(selector);

//       nodes.forEach(el => {
//         const text = el.innerText.trim();
        
//         // Легкая чистка от пустых строк и явного мусора
//         // (Условие про скобки оставляю на всякий случай, если вдруг где-то нет стилей)
//         if (text.length > 2 && 
//             !text.includes('Праздники') && 
//             !text.includes('Календарь') &&
//             !(text.startsWith('(') && text.endsWith(')'))) {
//             holidaysSet.add(text);
//         }
//       });

//       return {
//         date: dateText,
//         holidays: Array.from(holidaysSet)
//       };
//     });

//     console.log(`Дата: ${result.date}`);
//     console.log(`Найдено записей: ${result.holidays.length}`);

//     fs.writeFileSync('data.json', JSON.stringify(result, null, 4));
//     console.log('data.json записан.');

//   } catch (error) {
//     console.error('Ошибка:', error.message);
//     try { await page.screenshot({ path: 'debug-screenshot.png', fullPage: true }); } catch (e) {}
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

     const addText = (rawText) => {
          if (!rawText) return;
          let text = rawText.trim();
          
          // Убираем маркеры списка (точки в начале)
          text = text.replace(/^[•\-\.]\s*/, '');
          
          // Фильтры мусора:
          if (text.length < 3) return; // Слишком коротко
          if (text.startsWith('(') && text.endsWith(')')) return; // Английский в скобках
          if (text.includes('Праздники')) return; // Навигация
          if (text.includes('Календарь')) return; // Ссылка на календарь
          
          holidaysSet.add(text);
      };

      const mainTable = document.querySelector('table.art-article[align="center"]');
      if (mainTable) {
        // Берем все параграфы внутри ячеек
        const paragraphs = mainTable.querySelectorAll('td p');
        paragraphs.forEach(p => {
            // Пропускаем, если внутри только картинка
            if (p.querySelector('img') && !p.innerText.trim()) return;
            
            // Пропускаем строки с английским переводом (они обычно font-size: medium)
            const smallFont = p.querySelector('span[style*="font-size: medium"]');
            if (smallFont && p.innerText.trim() === smallFont.innerText.trim()) return;

            addText(p.innerText);
        });
    }
    // const allH2 = Array.from(document.querySelectorAll('h2'));
    //     const orthodoxHeader = allH2.find(h2 => h2.textContent.includes('Православные праздники'));
        
    //     if (orthodoxHeader) {
    //         // Обычно после заголовка идет таблица или список. 
    //         // В твоем HTML это <tr> внутри таблицы, но визуально он отделен.
    //         // Самый надежный способ - искать таблицу, следующую за этим заголовком,
    //         // ИЛИ (как в твоем коде) это может быть просто часть той же большой структуры.
            
    //         // Попробуем найти родительскую таблицу или контейнер
    //         let container = orthodoxHeader.closest('tr'); 
    //         // Если заголовок внутри TR, значит следующие TR содержат праздники
    //         if (container) {
    //             let nextRow = container.nextElementSibling;
    //             while (nextRow) {
    //                 // Если наткнулись на новый заголовок (например "Сегодня так же отмечают") - стоп
    //                 if (nextRow.textContent.includes('Сегодня так же отмечают')) break;

    //                 const paragraphs = nextRow.querySelectorAll('p');
    //                 paragraphs.forEach(p => {
    //                      if (p.querySelector('img') && !p.innerText.trim()) return;
    //                      const text = cleanText(p.innerText);
    //                      if (text) result.orthodoxHolidays.push(text);
    //                 });
    //                 nextRow = nextRow.nextElementSibling;
    //             }
    //         }
    //     }



      const allH2 = Array.from(document.querySelectorAll('h2'));
      const extraHeader = allH2.find(el => el.textContent.includes('Сегодня так же отмечают'));

      if (extraHeader) {
          // Перебираем элементы, идущие сразу после заголовка
          let sibling = extraHeader.nextElementSibling;
          
          while (sibling) {
              // Если наткнулись на разделитель или новую таблицу - останавливаемся
              if (sibling.tagName === 'HR' || sibling.tagName === 'TABLE' || sibling.tagName === 'DIV') {
                  break;
              }

              
              if (sibling.tagName === 'P') {
                  addText(sibling.innerText);
              }
              sibling = sibling.nextElementSibling;
          }
      } 

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