// game.js
class Game {
    constructor() {
        this.player = {
            consistency: 0,
            totalTowers: 0,
            totalFloors: 0,
            totalFalls: 0
        };
        
        this.currentTower = null;
        this.currentWorld = 'ring';
        this.currentLevel = 0;
        this.currentTowerIndex = 0;
        this.attempts = 0;
        this.log = [];
        this.isRunning = false;
        this.tickInterval = null;
        
        // Загружаем данные
        this.rings = EToHData.rings;
        this.zones = EToHData.zones;
        
        // Для модального окна
        this.modalWorld = 'ring';
        this.modalLevel = 0;
        this.towerProgress = {};
        
        // Статистика
        this.hardestTower = null;
        this.totalDifficultySum = 0;
        this.totalTowersCompleted = 0;
    }
    
    selectWorld(world) {
        this.currentWorld = world;
        this.currentLevel = 0;
        if (window.renderLevels) {
            window.renderLevels(this);
            window.renderTowers(this);
        }
    }
    
    selectLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.currentTowerIndex = 0;
        if (window.renderTowers) {
            window.renderTowers(this);
        }
    }
    
    selectTower(towerIndex) {
        const world = this.currentWorld === 'ring' ? this.rings : this.zones;
        const level = world[this.currentLevel];
        
        if (!level || !level.towers[towerIndex]) return;
        
        const towerData = level.towers[towerIndex];
        this.currentTowerIndex = towerIndex;
        
        // Сохраняем прогресс текущей башни
        if (this.currentTower) {
            if (!this.towerProgress) this.towerProgress = {};
            this.towerProgress[this.currentTower.name] = {
                currentFloor: this.currentTower.currentFloor,
                completed: this.currentTower.currentFloor >= this.currentTower.maxFloor,
                attempts: this.currentTower.attempts || 0,
                difficultyValue: this.currentTower.difficultyValue || 0,
                difficulty: this.currentTower.difficulty
            };
        }
        
        // Загружаем прогресс новой башни
        const savedProgress = this.towerProgress && this.towerProgress[towerData.name];
        
        this.currentTower = {
            name: towerData.name,
            floors: towerData.floors,
            difficulty: towerData.difficulty,
            difficultyValue: towerData.difficultyValue || 0,
            currentFloor: savedProgress ? savedProgress.currentFloor : 0,
            maxFloor: towerData.floors,
            attempts: savedProgress ? savedProgress.attempts : 0
        };
        
        // Сброс consistency при смене башни
        this.player.consistency = 0;
        this.attempts = 0;
        
        this.addLog(`🏰 Выбрана башня: ${towerData.name} (${towerData.floors} этажей)`);
        if (savedProgress && savedProgress.currentFloor > 0) {
            this.addLog(`📌 Продолжение с этажа ${savedProgress.currentFloor}`);
        }
        
        const btnClimb = document.getElementById('btnClimb');
        if (btnClimb) btnClimb.disabled = false;
        
        this.updateUI();
    }
    
    climb() {
        if (!this.currentTower) {
            this.addLog('⚠️ Сначала выберите башню!');
            return;
        }
        
        const tower = this.currentTower;
        const player = this.player;
        
        if (tower.currentFloor >= tower.maxFloor) {
            this.addLog('✅ Башня уже пройдена! Выберите новую.');
            return;
        }
        
        this.attempts++;
        tower.attempts = (tower.attempts || 0) + 1;
        
        // Рассчёт шанса падения
        const progress = tower.currentFloor / tower.maxFloor;
        const consistencyBonus = player.consistency / 100;
        const fallChance = progress * (1 - consistencyBonus);
        
        if (Math.random() < fallChance) {
            const fallTo = Math.floor(Math.random() * Math.max(1, tower.currentFloor));
            tower.currentFloor = fallTo;
            player.totalFalls++;
            this.addLog(`💀 ПАДЕНИЕ! Вы упали на этаж ${fallTo}`);
        } else {
            tower.currentFloor++;
            player.totalFloors++;
            player.consistency = Math.min(100, player.consistency + 0.5);
            
            this.addLog(`⬆ Подъём на этаж ${tower.currentFloor}/${tower.maxFloor}`);
            
            if (tower.currentFloor >= tower.maxFloor) {
                this.towerDefeated();
            }
        }
        
        this.updateUI();
    }
    
    towerDefeated() {
        const tower = this.currentTower;
        this.player.totalTowers++;
        this.totalTowersCompleted++;
        
        // Обновляем статистику
        const diffValue = tower.difficultyValue || 0;
        this.totalDifficultySum += diffValue;
        
        // Проверяем, самая сложная ли это башня
        if (!this.hardestTower || diffValue > this.hardestTower.difficultyValue) {
            this.hardestTower = {
                name: tower.name,
                difficultyValue: diffValue,
                difficulty: tower.difficulty,
                floors: tower.floors
            };
        }
        
        this.addLog(`🎉 БАШНЯ ПРОЙДЕНА! ${tower.name} (${tower.floors} этажей)`);
        this.addLog(`📊 Попыток: ${tower.attempts || 0}, Consistency: ${Math.round(this.player.consistency)}%`);
        
        const btnClimb = document.getElementById('btnClimb');
        if (btnClimb) btnClimb.disabled = true;
        
        if (!this.towerProgress) this.towerProgress = {};
        this.towerProgress[tower.name] = {
            currentFloor: tower.maxFloor,
            completed: true,
            attempts: tower.attempts || 0,
            difficultyValue: tower.difficultyValue || 0,
            difficulty: tower.difficulty
        };
        
        this.updateUI();
    }
    
    getAverageSkill() {
        if (this.totalTowersCompleted === 0) return 0;
        return this.totalDifficultySum / this.totalTowersCompleted;
    }
    
    getTowerSubTier(towerName) {
        const allTowers = [...this.rings, ...this.zones].flatMap(l => l.towers);
        const found = allTowers.find(t => t.name === towerName);
        if (found) {
            return getSubTier(found.difficultyValue || 0);
        }
        return SubTiers['baseline'];
    }
    
    addLog(message) {
        this.log.unshift(message);
        if (this.log.length > 3) this.log.pop();
    }
    
    updateUI() {
        if (window.updateUI) window.updateUI(this);
    }
    
    start() {
        this.addLog('🔥 Игра запущена! Выберите башню и начните восхождение');
        
        if (window.renderLevels) {
            window.renderLevels(this);
            window.renderTowers(this);
        }
        
        this.tickInterval = setInterval(() => {
            this.updateUI();
        }, 1000);
    }
    
    stop() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
    }
}

// Делаем класс глобальным
window.Game = Game;
