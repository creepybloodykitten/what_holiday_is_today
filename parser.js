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

//      const addText = (rawText) => {
//           if (!rawText) return;
//           let text = rawText.trim();
          
//           // Убираем маркеры списка (точки в начале)
//           text = text.replace(/^[•\-\.]\s*/, '');
          
//           // Фильтры мусора:
//           if (text.length < 3) return; // Слишком коротко
//           if (text.startsWith('(') && text.endsWith(')')) return; // Английский в скобках
//           if (text.includes('Праздники')) return; // Навигация
//           if (text.includes('Календарь')) return; // Ссылка на календарь
          
//           holidaysSet.add(text);
//       };

//       const mainTable = document.querySelector('table.art-article[align="center"]');
//       if (mainTable) {
//         // Берем все параграфы внутри ячеек
//         const paragraphs = mainTable.querySelectorAll('td p');
//         paragraphs.forEach(p => {
//             // Пропускаем, если внутри только картинка
//             if (p.querySelector('img') && !p.innerText.trim()) return;
            
//             // Пропускаем строки с английским переводом (они обычно font-size: medium)
//             const smallFont = p.querySelector('span[style*="font-size: medium"]');
//             if (smallFont && p.innerText.trim() === smallFont.innerText.trim()) return;

//             addText(p.innerText);
//         });
//     }

//       // const allH2 = Array.from(document.querySelectorAll('h2'));
//       // const extraHeader = allH2.find(el => el.textContent.includes('Сегодня так же отмечают'));

//       // if (extraHeader) {
//       //     // Перебираем элементы, идущие сразу после заголовка
//       //     let sibling = extraHeader.nextElementSibling;
          
//       //     while (sibling) {
//       //         if (dateEl && (sibling === dateEl || sibling.contains(dateEl))) {
//       //             break;
//       //         }
//       //         if (sibling.tagName === 'HR' || sibling.tagName === 'TABLE' || sibling.tagName === 'DIV' || sibling.tagName === 'H2') {
//       //             break;
//       //         }
//       //         if (sibling.textContent.includes('день в году') || sibling.textContent.includes('До конца года')) break;

              
//       //         if (sibling.tagName === 'P') {
//       //             addText(sibling.innerText);
//       //         }
//       //         sibling = sibling.nextElementSibling;
//       //     }
//       // } 

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



//тут типа добавил img а самый вверхний -исходный вариант
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

//      const addText = (rawText) => {
//           if (!rawText) return;
//           let text = rawText.trim();
          
//           // Убираем маркеры списка (точки в начале)
//           text = text.replace(/^[•\-\.]\s*/, '');
          
//           // Фильтры мусора:
//           if (text.length < 3) return; // Слишком коротко
//           if (text.startsWith('(') && text.endsWith(')')) return; // Английский в скобках
//           if (text.includes('Праздники')) return; // Навигация
//           if (text.includes('Календарь')) return; // Ссылка на календарь
          
//           holidaysSet.add(text);
//       };

//       const mainTable = document.querySelector('table.art-article[align="center"]');
//       if (mainTable) {
//         // Берем все параграфы внутри ячеек
//         const images = mainTable.querySelectorAll('td p img');
//         images.forEach(img => {
//               const p = img.closest('p');
//               if (p) addText(p.innerText);
//         });
//     }

//       // const allH2 = Array.from(document.querySelectorAll('h2'));
//       // const extraHeader = allH2.find(el => el.textContent.includes('Сегодня так же отмечают'));

//       // if (extraHeader) {
//       //     // Перебираем элементы, идущие сразу после заголовка
//       //     let sibling = extraHeader.nextElementSibling;
          
//       //     while (sibling) {
//       //         if (dateEl && (sibling === dateEl || sibling.contains(dateEl))) {
//       //             break;
//       //         }
//       //         if (sibling.tagName === 'HR' || sibling.tagName === 'TABLE' || sibling.tagName === 'DIV' || sibling.tagName === 'H2') {
//       //             break;
//       //         }
//       //         if (sibling.textContent.includes('день в году') || sibling.textContent.includes('До конца года')) break;

              
//       //         if (sibling.tagName === 'P') {
//       //             addText(sibling.innerText);
//       //         }
//       //         sibling = sibling.nextElementSibling;
//       //     }
//       // } 

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

        for (const p of paragraphs)
        {
          if (dateEl && p.contains(dateEl)) break; 
          if (p.querySelector('img') && !p.innerText.trim()) continue;

          const smallFont = p.querySelector('span[style*="font-size: medium"]');
          if (smallFont && p.innerText.trim() === smallFont.innerText.trim()) return;

          addText(p.innerText);
        }
    }

      // const allH2 = Array.from(document.querySelectorAll('h2'));
      // const extraHeader = allH2.find(el => el.textContent.includes('Сегодня так же отмечают'));

      // if (extraHeader) {
      //     // Перебираем элементы, идущие сразу после заголовка
      //     let sibling = extraHeader.nextElementSibling;
          
      //     while (sibling) {
      //         if (dateEl && (sibling === dateEl || sibling.contains(dateEl))) {
      //             break;
      //         }
      //         if (sibling.tagName === 'HR' || sibling.tagName === 'TABLE' || sibling.tagName === 'DIV' || sibling.tagName === 'H2') {
      //             break;
      //         }
      //         if (sibling.textContent.includes('день в году') || sibling.textContent.includes('До конца года')) break;

              
      //         if (sibling.tagName === 'P') {
      //             addText(sibling.innerText);
      //         }
      //         sibling = sibling.nextElementSibling;
      //     }
      // } 

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