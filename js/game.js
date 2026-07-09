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
    }
    
    selectWorld(world) {
        this.currentWorld = world;
        this.currentLevel = 0;
        // Обновляем модальное окно через ui.js
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
                attempts: this.currentTower.attempts || 0
            };
        }
        
        // Загружаем прогресс новой башни
        const savedProgress = this.towerProgress && this.towerProgress[towerData.name];
        
        this.currentTower = {
            name: towerData.name,
            floors: towerData.floors,
            difficulty: towerData.difficulty,
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
        
        // Активируем кнопку
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
        
        // Проверка: башня уже пройдена?
        if (tower.currentFloor >= tower.maxFloor) {
            this.addLog('✅ Башня уже пройдена! Выберите новую.');
            return;
        }
        
        // Увеличиваем попытки
        this.attempts++;
        tower.attempts = (tower.attempts || 0) + 1;
        
        // Рассчёт шанса падения
        const progress = tower.currentFloor / tower.maxFloor;
        const consistencyBonus = player.consistency / 100;
        const fallChance = progress * (1 - consistencyBonus);
        
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
            
            // Рост consistency
            player.consistency = Math.min(100, player.consistency + 0.5);
            
            // Усталость растёт медленно
            player.fatigue = Math.min(100, player.fatigue + 1);
            
            this.addLog(`⬆ Подъём на этаж ${tower.currentFloor}/${tower.maxFloor}`);
            
            // Проверка прохождения башни
            if (tower.currentFloor >= tower.maxFloor) {
                this.towerDefeated();
            }
        }
        
        // Снижение усталости
        player.fatigue = Math.max(0, player.fatigue - player.fatigueDecay);
        
        this.updateUI();
        
        // Обновляем модальное окно, если оно открыто
        if (document.getElementById('towerModal').classList.contains('active')) {
            if (window.renderTowers) window.renderTowers(this);
        }
    }
    
    towerDefeated() {
        const tower = this.currentTower;
        this.player.totalTowers++;
        this.addLog(`🎉 БАШНЯ ПРОЙДЕНА! ${tower.name} (${tower.floors} этажей)`);
        this.addLog(`📊 Попыток: ${tower.attempts || 0}, Consistency: ${Math.round(this.player.consistency)}%`);
        
        // Бонус: снижение усталости
        this.player.fatigue = Math.max(0, this.player.fatigue - 30);
        
        // Отключаем кнопку
        const btnClimb = document.getElementById('btnClimb');
        if (btnClimb) btnClimb.disabled = true;
        
        // Сохраняем прогресс
        if (!this.towerProgress) this.towerProgress = {};
        this.towerProgress[tower.name] = {
            currentFloor: tower.maxFloor,
            completed: true,
            attempts: tower.attempts || 0
        };
        
        this.updateUI();
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
        
        // Инициализируем модальное окно
        if (window.renderLevels) {
            window.renderLevels(this);
            window.renderTowers(this);
        }
        
        // Таймер для пассивного снижения усталости
        this.tickInterval = setInterval(() => {
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
