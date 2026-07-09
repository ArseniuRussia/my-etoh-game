// main.js
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    window.game = game; // для доступа из модального окна
    
    // Инициализация модального окна
    game.modalWorld = 'ring';
    game.modalLevel = 0;
    game.towerProgress = {}; // сохраняем прогресс по башням
    
    // Загрузка сохранения
    if (loadGame(game)) {
        game.updateUI();
    }
    
    game.start();
    
    // Кнопка "Взобраться"
    document.getElementById('btnClimb').addEventListener('click', () => {
        game.climb();
    });
    
    // Кнопка "Выбрать башню"
    document.getElementById('btnChoose').addEventListener('click', () => {
        renderModal(game);
        openModal();
    });
    
    // Кнопка "Сохранить"
    document.getElementById('btnSave').addEventListener('click', () => {
        // Сохраняем прогресс текущей башни
        if (game.currentTower) {
            if (!game.towerProgress) game.towerProgress = {};
            game.towerProgress[game.currentTower.name] = {
                currentFloor: game.currentTower.currentFloor,
                completed: game.currentTower.currentFloor >= game.currentTower.maxFloor,
                attempts: game.currentTower.attempts || 0
            };
        }
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
    
    // Закрытие модального окна
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('towerModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    
    // Переключение миров в модальном окне
    document.querySelectorAll('.world-tab-modal').forEach(tab => {
        tab.addEventListener('click', () => {
            selectWorldFromModal(tab.dataset.world);
        });
    });
    
    // Клавиши
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            game.climb();
        } else if (e.key === '2') {
            renderModal(game);
            openModal();
        } else if (e.key === '3') {
            document.getElementById('btnStats').click();
        } else if (e.key === '4') {
            document.getElementById('btnSave').click();
        } else if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Авто-обновление UI
    setInterval(() => {
        if (game) game.updateUI();
    }, 100);
});
