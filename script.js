// === Состояние игры ===
let game = {
    resource: 0,          // Текущий ресурс
    perSecond: 0,         // Сколько дают в секунду
    upgrades: [
        { name: '👷 Шахтер', baseCost: 10, cost: 10, amount: 0, production: 1 },
        { name: '🏗️ Фабрика', baseCost: 100, cost: 100, amount: 0, production: 5 }
    ]
};

// === DOM-ссылки ===
const resourceSpan = document.getElementById('resourceCount');
const perSecondSpan = document.getElementById('perSecond');
const clickBtn = document.getElementById('clickBtn');
const buyBtns = document.querySelectorAll('.buy-btn');

// === Функция отрисовки (обновляет интерфейс) ===
function render() {
    // Обновляем главное число
    resourceSpan.textContent = Math.floor(game.resource);
    // Обновляем производство в секунду
    perSecondSpan.textContent = game.perSecond;

    // Обновляем кнопки покупки (включаем/выключаем)
    buyBtns.forEach((btn, index) => {
        const upgrade = game.upgrades[index];
        if (game.resource >= upgrade.cost) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
        // Меняем текст кнопки, чтобы показывать цену
        btn.textContent = `Купить (${upgrade.cost})`;
    });
}

// === Обработчик клика по кнопке ===
clickBtn.addEventListener('click', () => {
    game.resource += 1;
    render();
});

// === Логика покупки улучшений ===
buyBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const upgrade = game.upgrades[index];
        
        // Проверяем, хватает ли ресурсов
        if (game.resource >= upgrade.cost) {
            // Списываем стоимость
            game.resource -= upgrade.cost;
            // Увеличиваем количество купленных
            upgrade.amount += 1;
            // Увеличиваем общее производство в секунду
            game.perSecond += upgrade.production;
            // Увеличиваем стоимость следующей покупки (формула: базовая * 1.15^количество)
            upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.amount));
            
            // Перерисовываем интерфейс
            render();
        }
    });
});

// === Игровой цикл (пассивный доход) ===
setInterval(() => {
    // Добавляем ресурс каждую секунду
    game.resource += game.perSecond;
    render();
}, 1000);

// === Первый рендер при загрузке ===
render();
