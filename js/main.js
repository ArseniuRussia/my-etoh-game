// main.js
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    
    // Загрузка сохранения
    if (loadGame(game)) {
        game.updateUI();
    }
    
    game.start();
    
    // Кнопка "Взобраться"
    document.getElementById('btnClimb').addEventListener('click', () => {
        game.climb();
    });
    
    // Кнопка "Сохранить"
    document.getElementById('btnSave').addEventListener('click', () => {
        saveGame(game);
    });
    
    // Кнопка "Статистика"
    document.getElementById('btnStats').addEventListener('click', () => {
        const tower = game.currentTower;
        if (tower) {
            game.addLog(`📊 Башня: ${tower.name}, Этаж: ${tower.currentFloor}/${tower.maxFloor}, Попыток: ${tower.attempts || 0}`);
        } else {
            game.addLog('📊 Выберите башню для статистики');
        }
        game.updateUI();
    });
    
    // Переключение между Ring и Zone
    document.querySelectorAll('.world-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.world-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            game.selectWorld(tab.dataset.world);
        });
    });
    
    // Клавиши
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            game.climb();
        } else if (e.key === '2') {
            document.getElementById('btnStats').click();
        } else if (e.key === '3') {
            document.getElementById('btnSave').click();
        }
    });
    
    // Авто-обновление UI
    setInterval(() => {
        if (game) game.updateUI();
    }, 100);
});
