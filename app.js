const messageElement = document.getElementById('message');
const dateElement = document.createElement('p'); 
messageElement.after(dateElement); 

// контейнер для списка праздников
let listContainer = document.getElementById('holidays-list');
if (!listContainer) {
    listContainer = document.createElement('div');
    listContainer.id = 'holidays-list';
    listContainer.style.textAlign = 'left'; 
    listContainer.style.marginTop = '20px';
    messageElement.after(listContainer);
}

async function loadHoliday() {
    messageElement.innerText = "Веит пж...";
    listContainer.innerHTML = ''; // очищение список перед загрузкой

    try {
        //  случайное число, чтобы не брать старый кэш
        const response = await fetch('data.json?v=' + new Date().getTime());
        
        if (!response.ok) throw new Error("Ошибка сети");

        const data = await response.json();
        
        // дата
        dateElement.innerText = `Сегодня: ${data.date}`;
        messageElement.style.display = 'none'; 

        // проходимся по всем праздникам и создаем для каждого строчку
        data.holidays.forEach(holidayText => {
            const item = document.createElement('div');
            item.style.padding = '10px';
            item.style.borderBottom = '1px solid #eee';
            item.style.fontSize = '16px';
            item.innerText = "🎉 " + holidayText;
            
            listContainer.appendChild(item);
        });
        
    } catch (error) {
        console.error(error);
        messageElement.innerText = "Не удалось загрузить праздники 😔";
        messageElement.style.display = 'block';
    }
}

loadHoliday();