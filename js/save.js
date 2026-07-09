// save.js
function saveGame(game) {
    // Сохраняем прогресс текущей башни
    if (game.currentTower) {
        if (!game.towerProgress) game.towerProgress = {};
        game.towerProgress[game.currentTower.name] = {
            currentFloor: game.currentTower.currentFloor,
            completed: game.currentTower.currentFloor >= game.currentTower.maxFloor,
            attempts: game.currentTower.attempts || 0
        };
    }
    
    const data = {
        player: game.player,
        currentTower: game.currentTower,
        towerProgress: game.towerProgress || {},
        totalTowers: game.player.totalTowers,
        totalFloors: game.player.totalFloors,
        totalFalls: game.player.totalFalls,
        timestamp: Date.now()
    };
    
    localStorage.setItem('etbh_save', JSON.stringify(data));
    game.addLog('💾 Игра сохранена!');
    game.updateUI();
}

function loadGame(game) {
    const raw = localStorage.getItem('etbh_save');
    if (!raw) return false;
    
    try {
        const data = JSON.parse(raw);
        game.player = data.player;
        game.currentTower = data.currentTower;
        game.towerProgress = data.towerProgress || {};
        game.player.totalTowers = data.totalTowers || 0;
        game.player.totalFloors = data.totalFloors || 0;
        game.player.totalFalls = data.totalFalls || 0;
        game.addLog('📂 Прогресс восстановлен!');
        return true;
    } catch (e) {
        return false;
    }
}
