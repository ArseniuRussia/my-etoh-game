// ui.js
function updateUI(game) {
    const tower = game.currentTower;
    const player = game.player;
    
    // Башня
    document.getElementById('towerName').textContent = tower.name;
    document.getElementById('towerType').textContent = `Тип: ${tower.type.name}`;
    document.getElementById('currentFloor').textContent = Math.max(0, Math.floor(tower.currentFloor));
    document.getElementById('maxFloor').textContent = tower.maxFloor;
    
    // Сложность
    const badge = document.getElementById('difficultyBadge');
    badge.textContent = tower.difficulty;
    
    // Прогресс
    const progress = Math.max(0, (1 - tower.currentFloor / tower.maxFloor) * 100);
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.floor(progress) + '%';
    
    // Статистика
    document.getElementById('totalTowers').textContent = player.totalTowers;
    document.getElementById('totalFloors').textContent = player.totalFloors;
    
    // Статусы
    document.getElementById('damage').textContent = Math.floor(player.clickPower);
    document.getElementById('fatigue').textContent = Math.floor(player.fatigue) + '%';
    document.getElementById('fatigueBar').style.width = player.fatigue + '%';
    document.getElementById('regen').textContent = player.baseRegen.toFixed(1) + '/сек';
    document.getElementById('consistency').textContent = Math.floor(player.consistency) + '%';
    document.getElementById('consistencyBar').style.width = player.consistency + '%';
    
    // Auto-badge
    const autoBadge = document.getElementById('autoBadge');
    if (player.consistency > 50) {
        autoBadge.classList.add('active');
        autoBadge.textContent = 'АВТО-КЛИК ' + Math.floor((player.consistency - 50) / 50 * 100) + '%';
    } else {
        autoBadge.classList.remove('active');
    }
    
    // Лог
    const logs = ['log1', 'log2', 'log3'];
    for (let i = 0; i < 3; i++) {
        document.getElementById(logs[i]).textContent = '> ' + (game.log[i] || '');
    }
}

// save.js
function saveGame(game) {
    const data = {
        player: game.player,
        tower: game.currentTower,
        log: game.log,
        timestamp: Date.now()
    };
    localStorage.setItem('etbh_save', JSON.stringify(data));
    game.addLog(' Игра сохранена!');
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
        game.addLog('Прогресс восстановлен!');
        return true;
    } catch (e) {
        return false;
    }
}
