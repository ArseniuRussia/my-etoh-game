// game.js
class Game {
    constructor() {
        this.player = {
            fatigue: 0,
            fatigueDecay: 0.3,
            consistency: 0,
            totalTowers: 0,
            totalFloors: 0,
            totalFalls: 0
        };
        
        this.currentTower = null;
        this.currentRing = null;
        this.currentZone = null;
        this.currentWorld = 'ring'; // 'ring' или 'zone'
        this.currentLevel = 0;
        this.currentTowerIndex = 0;
        this.attempts = 0;
        this.log = [];
        this.isRunning = false;
        this.tickInterval = null;
        
        // Загружаем данные
        this.rings = EToHData.rings;
        this.zones = EToHData.zones;
    }
    
    selectWorld(world) {
        this.currentWorld = world;
        this.currentLevel = 0;
    }
    
    selectLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.currentTowerIndex = 0;
    }
    
    selectTower(towerIndex) {
        const world = this.currentWorld === 'ring' ? this.rings : this.zones;
        const level = world[this.currentLevel];
        
        if (!level || !level.towers[towerIndex]) return;
        
        const towerData = level.towers[towerIndex];
        this.currentTowerIndex = towerIndex;
        this.currentTower = {
            name: towerData.name,
            floors: towerData.floors,
            difficulty: towerData.difficulty,
            currentFloor: 0, // начинаем с 0
            maxFloor: towerData.floors,
            attempts: 0
        };
        
        // Сброс consistency при смене башни
        this.player.consistency = 0;
        this.attempts = 0;
        this.addLog(`🏰 Выбрана башня: ${towerData.name} (${towerData.floors} этажей)`);
        this.updateUI();
        
        // Активируем кнопку
        document.getElementById('btnClimb').disabled = false;
    }
    
    climb() {
        if (!this.currentTower) return;
        
        const tower = this.currentTower;
        const player = this.player;
        
        // Проверка: башня уже пройдена?
        if (tower.currentFloor >= tower.maxFloor) {
            this.addLog('✅ Башня уже пройдена! Выберите новую.');
            return;
        }
        
        // Увеличиваем попытки
        this.attempts++;
        tower.attempts++;
        
        // Рассчёт шанса падения
        const progress = tower.currentFloor / tower.maxFloor;
        const consistencyBonus = player.consistency / 100;
        const fallChance = progress * (1 - consistencyBonus);
        
        // Логируем шанс
        this.addLog(`📊 Шанс падения: ${Math.round(fallChance * 100)}% (Этаж ${tower.currentFloor}/${tower.maxFloor})`);
        
        // Проверка падения
        if (Math.random() < fallChance) {
            // Падение!
            const fallTo = Math.floor(Math.random() * Math.max(1, tower.currentFloor));
            tower.currentFloor = fallTo;
            player.totalFalls++;
            this.addLog(`💀 ПАДЕНИЕ! Вы упали на этаж ${fallTo}`);
            
            // Усталость от падения
            player.fatigue = Math.min(100, player.fatigue + 15);
        } else {
            // Успешный подъём
            tower.currentFloor++;
            player.totalFloors++;
            
            // Рост consistency (медленно, но верно)
            player.consistency = Math.min(100, player.consistency + 0.5);
            
            // Усталость растёт медленно
            player.fatigue = Math.min(100, player.fatigue + 1);
            
            this.addLog(`⬆ Подъём на этаж ${tower.currentFloor}/${tower.maxFloor}`);
            
            // Проверка прохождения башни
            if (tower.currentFloor >= tower.maxFloor) {
                this.towerDefeated();
            }
        }
        
        // Снижение усталости со временем (пассивно)
        player.fatigue = Math.max(0, player.fatigue - player.fatigueDecay);
        
        this.updateUI();
    }
    
    towerDefeated() {
        const tower = this.currentTower;
        this.player.totalTowers++;
        this.addLog(`🎉 БАШНЯ ПРОЙДЕНА! ${tower.name} (${tower.floors} этажей)`);
        this.addLog(`📊 Попыток: ${tower.attempts}, Consistency: ${Math.round(this.player.consistency)}%`);
        
        // Бонус: снижение усталости
        this.player.fatigue = Math.max(0, this.player.fatigue - 30);
        
        // Отключаем кнопку, чтобы игрок выбрал новую башню
        document.getElementById('btnClimb').disabled = true;
        
        this.updateUI();
    }
    
    // Обновление UI для выбора миров
    updateWorldLevels() {
        const container = document.getElementById('worldLevels');
        const world = this.currentWorld === 'ring' ? this.rings : this.zones;
        
        container.innerHTML = world.map((level, index) => `
            <button class="level-btn ${index === this.currentLevel ? 'active' : ''}" 
                    data-index="${index}"
                    onclick="game.selectLevel(${index})">
                ${level.name}
                <span class="level-diff">${level.difficulty}</span>
            </button>
        `).join('');
        
        // Обновляем список башен для текущего уровня
        this.updateTowerList();
    }
    
    updateTowerList() {
        const container = document.getElementById('towerList');
        const world = this.currentWorld === 'ring' ? this.rings : this.zones;
        const level = world[this.currentLevel];
        
        if (!level) {
            container.innerHTML = '<div class="empty-message">Нет башен в этом мире</div>';
            return;
        }
        
        container.innerHTML = level.towers.map((tower, index) => {
            const isCompleted = false; // можно позже добавить сохранение
            return `
                <button class="tower-btn ${index === this.currentTowerIndex ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                        data-index="${index}"
                        onclick="game.selectTower(${index})">
                    <span class="tower-name">${tower.name}</span>
                    <span class="tower-info-small">${tower.floors} этажей • ${tower.difficulty}</span>
                    ${isCompleted ? '<span class="tower-completed">✅</span>' : ''}
                </button>
            `;
        }).join('');
    }
    
    addLog(message) {
        this.log.unshift(message);
        if (this.log.length > 3) this.log.pop();
    }
    
    updateUI() {
        // Реализовано в ui.js
        if (window.updateUI) window.updateUI(this);
    }
    
    start() {
        this.addLog('🔥 Игра запущена! Выберите башню и начните восхождение');
        this.updateWorldLevels();
        this.tickInterval = setInterval(() => {
            // Пассивное снижение усталости
            if (this.player) {
                this.player.fatigue = Math.max(0, this.player.fatigue - this.player.fatigueDecay);
                this.updateUI();
            }
        }, 1000);
    }
    
    stop() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
    }
}
