// save.js
function saveGame(game) {
    if (game.currentTower) {
        if (!game.towerProgress) game.towerProgress = {};
        game.towerProgress[game.currentTower.name] = {
            currentFloor: game.currentTower.currentFloor,
            completed: game.currentTower.currentFloor >= game.currentTower.maxFloor,
            attempts: game.currentTower.attempts || 0,
            difficultyValue: game.currentTower.difficultyValue || 0,
            difficulty: game.currentTower.difficulty
        };
    }
    
    const data = {
        player: game.player,
        currentTower: game.currentTower,
        towerProgress: game.towerProgress || {},
        totalTowers: game.player.totalTowers,
        totalFloors: game.player.totalFloors,
        totalFalls: game.player.totalFalls,
        totalTowersCompleted: game.totalTowersCompleted || 0,
        totalDifficultySum: game.totalDifficultySum || 0,
        hardestTower: game.hardestTower || null,
        timestamp: Date.now()
    };
    
    localStorage.setItem('etoh_save', JSON.stringify(data));
    game.addLog('💾 Игра сохранена!');
    game.updateUI();
}

function loadGame(game) {
    const raw = localStorage.getItem('etoh_save');
    if (!raw) return false;
    
    try {
        const data = JSON.parse(raw);
        game.player = data.player;
        game.currentTower = data.currentTower;
        game.towerProgress = data.towerProgress || {};
        game.player.totalTowers = data.totalTowers || 0;
        game.player.totalFloors = data.totalFloors || 0;
        game.player.totalFalls = data.totalFalls || 0;
        game.totalTowersCompleted = data.totalTowersCompleted || 0;
        game.totalDifficultySum = data.totalDifficultySum || 0;
        game.hardestTower = data.hardestTower || null;
        
        // Восстанавливаем difficultyValue для текущей башни
        if (game.currentTower && !game.currentTower.difficultyValue) {
            const allTowers = [...game.rings, ...game.zones].flatMap(l => l.towers);
            const found = allTowers.find(t => t.name === game.currentTower.name);
            if (found) {
                game.currentTower.difficultyValue = found.difficultyValue || 0;
                game.currentTower.difficulty = found.difficulty;
            }
        }
        
        game.addLog('📂 Прогресс восстановлен!');
        return true;
    } catch (e) {
        return false;
    }
}
