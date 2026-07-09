// main.js
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    // Загрузка сохранения
    if (loadGame(game)) {
        updateUI(game);
    } else {
        game.start();
        updateUI(game);
    }
    
    // Кнопка "Взобраться"
    document.getElementById('btnClimb').addEventListener('click', () => {
        game.climb();
        updateUI(game);
    });
    
    // Кнопка "Сохранить"
    document.getElementById('btnSave').addEventListener('click', () => {
        saveGame(game);
    });
    
    // Клавиши 1-4
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            game.climb();
            updateUI(game);
        } else if (e.key === '4') {
            saveGame(game);
        } else if (e.key === '2') {
            game.addLog(`📊 Башен: ${game.player.totalTowers}, Этажей: ${game.player.totalFloors}`);
            updateUI(game);
        } else if (e.key === '3') {
            game.addLog('⚙ Меню улучшений в разработке...');
            updateUI(game);
        }
    });
    
    // Авто-обновление UI каждые 100ms
    setInterval(() => updateUI(game), 100);
});
