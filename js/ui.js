// ui.js

// ===== ОСНОВНОЙ UI =====

function updateUI(game) {
    if (!game || !game.currentTower) {
        document.getElementById('towerName').textContent = 'Выберите башню';
        document.getElementById('difficultyBadge').textContent = '-';
        document.getElementById('currentFloor').textContent = '0';
        document.getElementById('maxFloor').textContent = '0';
        document.getElementById('attempts').textContent = '0';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressText').textContent = '0%';
        document.getElementById('towerDifficultyValue').textContent = '0.00';
        document.getElementById('btnClimb').disabled = true;
        return;
    }
    
    const tower = game.currentTower;
    const player = game.player;
    const diffValue = tower.difficultyValue || 0;
    const subTier = getSubTier(diffValue);
    const mainName = DifficultyOrder[Math.floor(diffValue)] || 'Unknown';
    
    // Форматируем сложность с под-тиром
    const formattedDiff = `${mainName} ${subTier.icon} ${subTier.label}`;
    
    document.getElementById('towerName').textContent = tower.name;
    document.getElementById('difficultyBadge').textContent = formattedDiff;
    document.getElementById('difficultyBadge').title = `Сложность: ${diffValue.toFixed(2)}`;
    document.getElementById('towerType').textContent = `Тип: ${mainName}`;
    document.getElementById('currentFloor').textContent = tower.currentFloor;
    document.getElementById('maxFloor').textContent = tower.maxFloor;
    document.getElementById('attempts').textContent = tower.attempts || 0;
    document.getElementById('towerDifficultyValue').textContent = diffValue.toFixed(2);
    
    const progress = (tower.currentFloor / tower.maxFloor) * 100;
    document.getElementById('progressBar').style.width = Math.min(100, progress) + '%';
    document.getElementById('progressText').textContent = Math.min(100, Math.round(progress)) + '%';
    
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


// ===== МОДАЛЬНОЕ ОКНО СТАТИСТИКИ =====

function openStatsModal() {
    const modal = document.getElementById('statsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderStats(game);
    }
}

function closeStatsModal() {
    const modal = document.getElementById('statsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderStats(game) {
    const body = document.getElementById('statsBody');
    if (!body) return;
    
    const player = game.player;
    const avgSkill = game.getAverageSkill ? game.getAverageSkill() : 0;
    const hardest = game.hardestTower;
    
    // Собираем все пройденные башни
    const completedTowers = [];
    if (game.towerProgress) {
        for (const [name, data] of Object.entries(game.towerProgress)) {
            if (data.completed) {
                completedTowers.push({
                    name: name,
                    difficultyValue: data.difficultyValue || 0,
                    difficulty: data.difficulty || 'Unknown',
                    attempts: data.attempts || 0,
                    floors: data.currentFloor || 0
                });
            }
        }
    }
    
    // Сортируем по сложности
    completedTowers.sort((a, b) => b.difficultyValue - a.difficultyValue);
    
    // Форматируем сложность для отображения
    function formatDiff(val) {
        const main = DifficultyOrder[Math.floor(val)] || 'Unknown';
        const sub = getSubTier(val);
        return `${main} ${sub.icon} ${sub.label} (${val.toFixed(2)})`;
    }
    
    body.innerHTML = `
        <div class="stats-grid">
            <div class="stats-card">
                <div class="stats-number">${player.totalTowers}</div>
                <div class="stats-label">🏆 Башен пройдено</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${player.totalFloors}</div>
                <div class="stats-label">📈 Всего этажей</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${player.totalFalls}</div>
                <div class="stats-label">💀 Падений</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${avgSkill.toFixed(2)}</div>
                <div class="stats-label">📊 Средний скилл</div>
            </div>
        </div>
        
        ${hardest ? `
            <div class="stats-hardest">
                <h3>🏆 СЛОЖНЕЙШАЯ ПРОЙДЕННАЯ БАШНЯ</h3>
                <div class="hardest-info">
                    <span class="hardest-name">${hardest.name}</span>
                    <span class="hardest-diff">${formatDiff(hardest.difficultyValue)}</span>
                    <span class="hardest-floors">${hardest.floors} этажей</span>
                </div>
            </div>
        ` : `
            <div class="stats-hardest">
                <h3>🏆 СЛОЖНЕЙШАЯ ПРОЙДЕННАЯ БАШНЯ</h3>
                <div class="hardest-info" style="color: #666;">Пока нет пройденных башен</div>
            </div>
        `}
        
        ${completedTowers.length > 0 ? `
            <div class="stats-towers-list">
                <h3>📋 ВСЕ ПРОЙДЕННЫЕ БАШНИ</h3>
                <div class="towers-list">
                    ${completedTowers.map(t => `
                        <div class="tower-list-item">
                            <span class="tower-list-name">${t.name}</span>
                            <span class="tower-list-diff">${formatDiff(t.difficultyValue)}</span>
                            <span class="tower-list-attempts">${t.attempts} попыток</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : `
            <div class="stats-towers-list">
                <h3>📋 ВСЕ ПРОЙДЕННЫЕ БАШНИ</h3>
                <div style="color: #666; padding: 10px;">Пока нет пройденных башен</div>
            </div>
        `}
    `;
}


// ===== МОДАЛЬНОЕ ОКНО ВЫБОРА БАШНИ =====

function openModal() {
    const modal = document.getElementById('towerModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('towerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderModal(game) {
    if (!game) return;
    renderLevels(game);
    renderTowers(game);
}

function renderLevels(game) {
    const grid = document.getElementById('levelGrid');
    if (!grid) return;
    
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
    if (!grid) return;
    
    const world = game.modalWorld || 'ring';
    const data = world === 'ring' ? game.rings : game.zones;
    const level = data[game.modalLevel || 0];
    
    if (!level || !level.towers) {
        grid.innerHTML = '<div class="empty-message-modal">Нет башен в этом мире</div>';
        return;
    }
    
    const towerProgress = game.towerProgress || {};
    
    grid.innerHTML = level.towers.map((tower, index) => {
        const progress = towerProgress[tower.name] || { currentFloor: 0, completed: false };
        const isCompleted = progress.completed || false;
        const isActive = game.currentTower && game.currentTower.name === tower.name;
        const diffValue = tower.difficultyValue || 0;
        const subTier = getSubTier(diffValue);
        const mainName = DifficultyOrder[Math.floor(diffValue)] || 'Unknown';
        
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
        
        const diffDisplay = `${mainName} ${subTier.icon}`;
        
        return `
            <div class="tower-card-modal ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                 onclick="selectTowerFromModal(${index})">
                <div class="tower-name-modal">${tower.name}</div>
                <div class="tower-diff-modal">${diffDisplay} <span style="color:#666;font-size:10px;">${diffValue.toFixed(2)}</span></div>
                <div class="tower-stats-modal">
                    <span>${tower.floors} этажей</span>
                    <span class="tower-status-modal ${statusClass}">${statusText}</span>
                </div>
                <div class="tower-hover-info">
                    <div class="info-row">
                        <span class="label">Сложность</span>
                        <span class="value">${mainName} ${subTier.icon} ${subTier.label}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Значение</span>
                        <span class="value">${diffValue.toFixed(2)}</span>
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


// ===== ФУНКЦИИ ВЫБОРА =====

function selectWorldFromModal(world) {
    const game = window.game;
    if (!game) return;
    
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
    if (!game) return;
    
    game.modalLevel = index;
    
    document.querySelectorAll('.level-btn-modal').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.index) === index);
    });
    
    renderTowers(game);
}

function selectTowerFromModal(index) {
    const game = window.game;
    if (!game) return;
    
    const world = game.modalWorld || 'ring';
    const data = world === 'ring' ? game.rings : game.zones;
    const level = data[game.modalLevel || 0];
    const towerData = level.towers[index];
    
    if (!towerData) return;
    
    // Сохраняем прогресс текущей башни
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
    
    // Загружаем прогресс новой башни
    const savedProgress = game.towerProgress && game.towerProgress[towerData.name];
    
    game.currentTower = {
        name: towerData.name,
        floors: towerData.floors,
        difficulty: towerData.difficulty,
        difficultyValue: towerData.difficultyValue || 0,
        currentFloor: savedProgress ? savedProgress.currentFloor : 0,
        maxFloor: towerData.floors,
        attempts: savedProgress ? savedProgress.attempts : 0
    };
    
    game.player.consistency = 0;
    
    game.addLog(`🏰 Выбрана башня: ${towerData.name} (${towerData.floors} этажей)`);
    if (savedProgress && savedProgress.currentFloor > 0) {
        game.addLog(`📌 Продолжение с этажа ${savedProgress.currentFloor}`);
    }
    
    game.updateUI();
    closeModal();
}


// ===== ДЕЛАЕМ ФУНКЦИИ ГЛОБАЛЬНЫМИ =====

window.updateUI = updateUI;
window.openStatsModal = openStatsModal;
window.closeStatsModal = closeStatsModal;
window.renderStats = renderStats;
window.openModal = openModal;
window.closeModal = closeModal;
window.renderModal = renderModal;
window.renderLevels = renderLevels;
window.renderTowers = renderTowers;
window.selectWorldFromModal = selectWorldFromModal;
window.selectLevel = selectLevel;
window.selectTowerFromModal = selectTowerFromModal;
