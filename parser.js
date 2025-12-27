
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const now = new Date();
const vdkDate = new Date(now.getTime() + (10 * 60 * 60 * 1000));//владивосток

const day = vdkDate.getDate();       // Число (27, 28...)
const monthIndex = vdkDate.getMonth(); // 0..11

// Массив 1: Для части "v-dekabre" (в ком?)
const monthsIn = [
    'v-janvare', 'v-fevrale', 'v-marte', 'v-aprele', 'v-mae', 'v-ijune',
    'v-ijule', 'v-avguste', 'v-sentjabre', 'v-oktjabre', 'v-nojabre', 'v-dekabre'
];

// Массив 2: Для части "27-dekabrja" (чего?)
const monthsGenitive = [
    'janvarja', 'fevralja', 'marta', 'aprelja', 'maja', 'ijunja',
    'ijulja', 'avgusta', 'sentjabrja', 'oktjabrja', 'nojabrja', 'dekabrja'
];

// Получаем нужные строки
const monthPart1 = monthsIn[monthIndex];       // например, "v-dekabre"
const monthPart2 = monthsGenitive[monthIndex]; // например, "dekabrja"

// Собираем ссылку: https://.../prazdniki/v-dekabre/27-dekabrja
const URL = `https://kakoj-segodnja-prazdnik.com/prazdniki/${monthPart1}/${day}-${monthPart2}`;

//const URL = 'https://kakoj-segodnja-prazdnik.com/';

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
          
          holidaysSet.add(text+ '!!!');
      };

      const mainTable = document.querySelector('table.art-article[align="center"]');
      if (mainTable) {
        // Берем все параграфы внутри ячеек
        const paragraphs = mainTable.querySelectorAll('td p');
        
        for (const p of paragraphs)
        {
          let text = p.innerText.trim();
          //if (text.textContent.includes('день в году') || text.textContent.includes('До конца года')) break;
          if (text.includes('день в году') || text.includes('До конца года')) break;
          if (dateEl && p.contains(dateEl)) break; 
          if (p.querySelector('img') && !p.innerText.trim()) continue;
          if (text.length > 200) continue; 
          if (!text) continue;

          const smallFont = p.querySelector('span[style*="font-size: medium"]');
          if (smallFont && p.innerText.trim() === smallFont.innerText.trim()) continue;

          addText(text);
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