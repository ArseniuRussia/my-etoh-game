// save.js
function saveGame(game) {
    const data = {
        player: game.player,
        tower: game.currentTower,
        log: game.log,
        timestamp: Date.now()
    };
    localStorage.setItem('etbh_save', JSON.stringify(data));
    game.addLog('💾 Игра сохранена!');
    updateUI(game);
}

function loadGame(game) {
    const raw = localStorage.getItem('etbh_save');
    if (!raw) return false;
    
    try {
        const data = JSON.parse(raw);
        game.player = data.player;
        game.currentTower = data.tower;
        game.log = data.log || ['📂 Загрузка завершена'];
        game.addLog('📂 Прогресс восстановлен!');
        return true;
    } catch (e) {
        return false;
    }
}
