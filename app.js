const button = document.getElementById('clickBtn');
const message = document.getElementById('message');

const phrases = [
    "1",
    "2",
    "3",
    "4"
];

button.addEventListener('click', () => {
    // Выбираем случайную фразу
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    message.innerText = randomPhrase;
    
    // Вибрация телефона (работает на Android, на iOS зависит от настроек)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
});