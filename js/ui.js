// ui.js
function updateUI(game) {
    if (!game || !game.currentTower) {
        document.getElementById('towerName').textContent = 'Выберите башню';
        document.getElementById('difficultyBadge').textContent = '-';
        document.getElementById('towerType').textContent = 'Тип: -';
        document.getElementById('currentFloor').textContent = '0';
        document.getElementById('maxFloor').textContent = '0';
        document.getElementById('attempts').textContent = '0';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';
        document.getElementById('btnClimb').disabled = true;
        return;
    }
    
    const tower = game.currentTower;
    const player = game.player;
    
    document.getElementById('towerName').textContent = tower.name;
    document.getElementById('difficultyBadge').textContent = tower.difficulty;
    document.getElementById('towerType').textContent = `Тип: ${tower.difficulty}`;
    document.getElementById('currentFloor').textContent = tower.currentFloor;
    document.getElementById('maxFloor').textContent = tower.maxFloor;
    document.getElementById('attempts').textContent = tower.attempts || 0;
    
    const progress = (tower.currentFloor / tower.maxFloor) * 100;
    document.getElementById('progressBar').style.width = Math.min(100, progress) + '%';
    document.getElementById('progressText').textContent = Math.min(100, Math.round(progress)) + '%';
    
    document.getElementById('totalTowers').textContent = player.totalTowers;
    document.getElementById('totalFloors').textContent = player.totalFloors;
    document.getElementById('totalFalls').textContent = player.totalFalls;
    
    const fatigue = Math.round(player.fatigue);
    document.getElementById('fatigue').textContent = fatigue + '%';
    document.getElementById('fatigueBar').style.width = fatigue + '%';
    
    const consistency = Math.round(player.consistency);
    document.getElementById('consistency').textContent = consistency + '%';
    document.getElementById('consistencyBar').style.width = consistency + '%';
    
    if (tower.currentFloor < tower.maxFloor) {
        const progressForFall = tower.currentFloor / tower.maxFloor;
        const fallChance = Math.round((progressForFall * (1 - player.consistency / 100)) * 100);
        document.getElementById('fallChance').textContent = fallChance + '%';
        document.getElementById('fallChance').style.color = fallChance > 50 ? '#e74c3c' : '#f39c12';
        document.getElementById('btnClimb').disabled = false;
    } else {
        document.getElementById('fallChance').textContent = '✅ Пройдена!';
        document.getElementById('fallChance').style.color = '#2ecc71';
        document.getElementById('btnClimb').disabled = true;
    }
    
    document.getElementById('progressStatus').textContent = Math.round(progress) + '%';
    
    const logs = ['log1', 'log2', 'log3'];
    for (let i = 0; i < 3; i++) {
        document.getElementById(logs[i]).textContent = '> ' + (game.log[i] || '');
    }
}

// ===== МОДАЛЬНОЕ ОКНО =====

function openModal() {
    document.getElementById('towerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderModal(game);
}

function closeModal() {
    document.getElementById('towerModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderModal(game) {
    // Шаг 1: Игры (пока только EToH)
    // Шаг 2: Миры (обновляем активную вкладку)
    const world = game.modalWorld || 'ring';
    document.querySelectorAll('.world-tab-modal').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.world === world);
    });
    
    // Шаг 3: Уровни
    renderLevels(game);
    
    // Шаг 4: Башни
    renderTowers(game);
}

function renderLevels(game) {
    const grid = document.getElementById('levelGrid');
    const world = game.modalWorld || 'ring';
    const data = world === 'ring' ? game.rings : game.zones;
    
    grid.innerHTML = data.map((level, index) => `
        <button class="level-btn-modal ${index === game.modalLevel ? 'active' : ''}"
                data-index="${index}"
                onclick="selectLevel(${index})">
            ${level.name}
            <span class="level-diff">${level.difficulty}</span>
        </button>
    `).join('');
}

function renderTowers(game) {
    const grid = document.getElementById('towerGrid');
    const world = game.modalWorld || 'ring';
    const data = world === 'ring' ? game.rings : game.zones;
    const level = data[game.modalLevel || 0];
    
    if (!level || !level.towers) {
        grid.innerHTML = '<div class="empty-message-modal">Нет башен в этом мире</div>';
        return;
    }
    
    // Получаем сохранённый прогресс по башням
    const towerProgress = game.towerProgress || {};
    
    grid.innerHTML = level.towers.map((tower, index) => {
        const progress = towerProgress[tower.name] || { currentFloor: 0, completed: false };
        const isCompleted = progress.completed || false;
        const isActive = game.currentTower && game.currentTower.name === tower.name;
        
        let statusText, statusClass;
        if (isCompleted) {
            statusText = '✅ Пройдена';
            statusClass = 'completed';
        } else if (progress.currentFloor > 0) {
            statusText = `📌 Этаж ${progress.currentFloor}/${tower.floors}`;
            statusClass = 'in-progress';
        } else {
            statusText = '🔒 Не начата';
            statusClass = 'locked';
        }
        
        return `
            <div class="tower-card-modal ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                 onclick="selectTowerFromModal(${index})">
                <div class="tower-name-modal">${tower.name}</div>
                <div class="tower-diff-modal">${tower.difficulty}</div>
                <div class="tower-stats-modal">
                    <span>${tower.floors} этажей</span>
                    <span class="tower-status-modal ${statusClass}">${statusText}</span>
                </div>
                <div class="tower-hover-info">
                    <div class="info-row">
                        <span class="label">Сложность</span>
                        <span class="value">${tower.difficulty}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Всего этажей</span>
                        <span class="value">${tower.floors}</span>
                    </div>
                    ${progress.currentFloor > 0 ? `
                        <div class="info-row">
                            <span class="label">Прогресс</span>
                            <span class="value">${Math.round((progress.currentFloor / tower.floors) * 100)}%</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Попыток</span>
                            <span class="value">${progress.attempts || 0}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Функции выбора в модальном окне
function selectWorldFromModal(world) {
    const game = window.game;
    game.modalWorld = world;
    game.modalLevel = 0;
    
    document.querySelectorAll('.world-tab-modal').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.world === world);
    });
    
    renderLevels(game);
    renderTowers(game);
}

function selectLevel(index) {
    const game = window.game;
    game.modalLevel = index;
    
    document.querySelectorAll('.level-btn-modal').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.index) === index);
    });
    
    renderTowers(game);
}

function selectTowerFromModal(index) {
    const game = window.game;
    const world = game.modalWorld || 'ring';
    const data = world === 'ring' ? game.rings : game.zones;
    const level = data[game.modalLevel || 0];
    const towerData = level.towers[index];
    
    if (!towerData) return;
    
    // Сохраняем прогресс текущей башни перед сменой
    if (game.currentTower) {
        if (!game.towerProgress) game.towerProgress = {};
        game.towerProgress[game.currentTower.name] = {
            currentFloor: game.currentTower.currentFloor,
            completed: game.currentTower.currentFloor >= game.currentTower.maxFloor,
            attempts: game.currentTower.attempts || 0
        };
    }
    
    // Загружаем прогресс новой башни
    const savedProgress = game.towerProgress && game.towerProgress[towerData.name];
    
    game.currentTower = {
        name: towerData.name,
        floors: towerData.floors,
        difficulty: towerData.difficulty,
        currentFloor: savedProgress ? savedProgress.currentFloor : 0,
        maxFloor: towerData.floors,
        attempts: savedProgress ? savedProgress.attempts : 0
    };
    
    // Сброс consistency при смене башни
    game.player.consistency = 0;
    
    game.addLog(`🏰 Выбрана башня: ${towerData.name} (${towerData.floors} этажей)`);
    if (savedProgress && savedProgress.currentFloor > 0) {
        game.addLog(`📌 Продолжение с этажа ${savedProgress.currentFloor}`);
    }
    
    game.updateUI();
    closeModal();
}

// Сохраняем в глобальный доступ
window.updateUI = updateUI;
window.openModal = openModal;
window.closeModal = closeModal;
window.selectWorldFromModal = selectWorldFromModal;
window.selectLevel = selectLevel;
window.selectTowerFromModal = selectTowerFromModal;
