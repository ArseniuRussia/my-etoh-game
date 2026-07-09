// ui.js
function updateUI(game) {
    if (!game || !game.currentTower) {
        // Если башня не выбрана
        document.getElementById('towerName').textContent = 'Выберите башню';
        document.getElementById('difficultyBadge').textContent = '-';
        document.getElementById('towerType').textContent = 'Тип: -';
        document.getElementById('currentFloor').textContent = '0';
        document.getElementById('maxFloor').textContent = '0';
        document.getElementById('attempts').textContent = '0';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';
        return;
    }
    
    const tower = game.currentTower;
    const player = game.player;
    
    // Башня
    document.getElementById('towerName').textContent = tower.name;
    document.getElementById('difficultyBadge').textContent = tower.difficulty;
    document.getElementById('towerType').textContent = `Тип: ${tower.difficulty}`;
    document.getElementById('currentFloor').textContent = tower.currentFloor;
    document.getElementById('maxFloor').textContent = tower.maxFloor;
    document.getElementById('attempts').textContent = tower.attempts || 0;
    
    // Прогресс
    const progress = (tower.currentFloor / tower.maxFloor) * 100;
    document.getElementById('progressBar').style.width = Math.min(100, progress) + '%';
    document.getElementById('progressText').textContent = Math.min(100, Math.round(progress)) + '%';
    
    // Статистика
    document.getElementById('totalTowers').textContent = player.totalTowers;
    document.getElementById('totalFloors').textContent = player.totalFloors;
    document.getElementById('totalFalls').textContent = player.totalFalls;
    
    // Статусы
    const fatigue = Math.round(player.fatigue);
    document.getElementById('fatigue').textContent = fatigue + '%';
    document.getElementById('fatigueBar').style.width = fatigue + '%';
    
    const consistency = Math.round(player.consistency);
    document.getElementById('consistency').textContent = consistency + '%';
    document.getElementById('consistencyBar').style.width = consistency + '%';
    
    // Шанс падения
    if (tower.currentFloor < tower.maxFloor) {
        const progressForFall = tower.currentFloor / tower.maxFloor;
        const fallChance = Math.round((progressForFall * (1 - player.consistency / 100)) * 100);
        document.getElementById('fallChance').textContent = fallChance + '%';
        document.getElementById('fallChance').style.color = fallChance > 50 ? '#e74c3c' : '#f39c12';
    } else {
        document.getElementById('fallChance').textContent = '✅ Пройдена!';
        document.getElementById('fallChance').style.color = '#2ecc71';
    }
    
    // Прогресс статус
    document.getElementById('progressStatus').textContent = Math.round(progress) + '%';
    
    // Лог
    const logs = ['log1', 'log2', 'log3'];
    for (let i = 0; i < 3; i++) {
        document.getElementById(logs[i]).textContent = '> ' + (game.log[i] || '');
    }
}

// Сохраняем функцию в глобальный доступ
window.updateUI = updateUI;
