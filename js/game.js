// game.js
class Game {
    constructor() {
        this.player = {
            baseRegen: 1.0,
            clickPower: 5,
            fatigue: 0,
            fatigueDecay: 0.5,
            consistency: 0,
            totalTowers: 0,
            totalFloors: 0
        };
        
        this.currentTower = this.generateTower();
        this.log = [];
        this.isRunning = true;
        this.tickInterval = null;
    }
    
    generateTower() {
        const types = [
            { name: 'Room', floors: 1 },
            { name: 'Edifice', floors: 3 },
            { name: 'Stepple', floors: 5 + Math.floor(Math.random() * 2) },
            { name: 'Not Even a Tower', floors: 3 },
            { name: 'Tower', floors: 10 },
            { name: 'Citadel', floors: 12 + Math.floor(Math.random() * 14) },
            { name: 'Obelisk', floors: 30 + Math.floor(Math.random() * 16) },
            { name: 'Great Citadel', floors: 100 + Math.floor(Math.random() * 101) }
        ];
        
        const difficulties = [
            'Effortless', 'Easy', 'Medium', 'Hard', 'Difficult',
            'Challenging', 'Intense', 'Remorseless', 'Insane',
            'Extreme', 'Terrifying', 'Catastrophic'
        ];
        
        const type = types[Math.floor(Math.random() * types.length)];
        const difficulty = difficulties[Math.floor(Math.random() * 5)]; // начальные сложности
        
        return {
            name: this.generateTowerName(),
            type: type,
            difficulty: difficulty,
            maxFloor: type.floors,
            currentFloor: type.floors,
            difficultyStars: Math.floor(Math.random() * 5) + 1
        };
    }
    
    generateTowerName() {
        const prefixes = ['Тёмная', 'Пылающая', 'Ледяная', 'Древняя', 'Проклятая', 'Бесконечная'];
        const suffixes = ['Башня', 'Цитадель', 'Обелиск', 'Крепость', 'Твердыня'];
        return prefixes[Math.floor(Math.random() * prefixes.length)] + ' ' + 
               suffixes[Math.floor(Math.random() * suffixes.length)];
    }
    
    climb() {
        let damage = this.player.clickPower;
        
        // Штраф за усталость
        if (this.player.fatigue > 50) {
            damage *= (1 - (this.player.fatigue - 50) / 100);
            if (damage < 0.5) damage = 0.5;
        }
        
        damage = Math.floor(damage);
        this.currentTower.currentFloor -= damage;
        this.player.totalFloors += damage;
        
        // Рост Consistency
        this.player.consistency += 0.01 * damage;
        if (this.player.consistency > 100) this.player.consistency = 100;
        
        // Усталость
        if (Math.random() < 0.1) {
            this.player.fatigue += 5 + Math.random() * 10;
            if (this.player.fatigue > 100) this.player.fatigue = 100;
            this.addLog('💤 Вы почувствовали усталость!');
        }
        
        this.addLog(`⬆ Вы взобрались на ${damage} этажей`);
        
        // Проверка падения башни
        if (this.currentTower.currentFloor <= 0) {
            this.towerDefeated();
        }
    }
    
    towerDefeated() {
        this.player.totalTowers++;
        this.addLog(`🏰 БАШНЯ ПАЛА! Побеждено: ${this.player.totalTowers}`);
        
        // Сброс consistency при смене башни
        if (this.player.consistency > 50) {
            this.player.consistency *= 0.7;
        } else {
            this.player.consistency = 0;
        }
        
        // Восстановление усталости
        this.player.fatigue = Math.max(0, this.player.fatigue - 30);
        
        this.currentTower = this.generateTower();
    }
    
    update() {
        // Пассивный реген
        let regen = this.player.baseRegen;
        if (this.player.fatigue > 70) regen *= 0.5;
        
        this.currentTower.currentFloor -= regen;
        
        // Auto-climb от Consistency
        if (this.player.consistency > 50) {
            const chance = (this.player.consistency - 50) / 100;
            if (Math.random() < chance) {
                this.currentTower.currentFloor -= 1;
                this.player.consistency += 0.005;
                this.player.totalFloors += 1;
                if (this.player.consistency > 100) this.player.consistency = 100;
            }
        }
        
        // Снижение усталости
        if (this.player.fatigue > 0) {
            this.player.fatigue -= this.player.fatigueDecay;
            if (this.player.fatigue < 0) this.player.fatigue = 0;
        }
        
        // Проверка падения башни
        if (this.currentTower.currentFloor <= 0) {
            this.towerDefeated();
        }
    }
    
    addLog(message) {
        this.log.unshift(message);
        if (this.log.length > 3) this.log.pop();
    }
    
    start() {
        this.addLog('Welcome to hell');
        this.tickInterval = setInterval(() => this.update(), 1000);
    }
    
    stop() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
    }
}
