const messageElement = document.getElementById('message');
const dateElement = document.getElementById('date-text'); // Теперь берем элемент из HTML
const listContainer = document.getElementById('holidays-list');


async function loadHoliday() {
    messageElement.innerText = "Веит пж...";
    dateElement.style.display = 'none';

    try {
        //  случайное число, чтобы не брать старый кэш
        const response = await fetch('data.json?v=' + new Date().getTime());
        
        if (!response.ok) throw new Error("Ошибка сети");

        const data = await response.json();
        messageElement.style.display = 'none'; 

        // дата
        dateElement.innerHTML = `Каждый день уникален<br>Сегодня: ${data.date}`;
        dateElement.style.display = 'block';

        // очищение список перед загрузкой
        listContainer.innerHTML = ''; 

        // проходимся по всем праздникам и создаем для каждого строчку
        data.holidays.forEach(holidayText => {
            const item = document.createElement('div');
            item.className = 'holiday-item';
            item.innerText = "🎉🎉🎉 " + holidayText;   
            listContainer.appendChild(item);
        });
        
    } catch (error) {
        console.error(error);
        messageElement.innerText = "Не удалось загрузить праздники 😔";
        messageElement.style.display = 'block';
    }
}

loadHoliday();