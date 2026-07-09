// main.js
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    window.game = game;
    
    game.modalWorld = 'ring';
    game.modalLevel = 0;
    game.towerProgress = {};
    
    if (loadGame(game)) {
        game.updateUI();
    }
    
    game.start();
    
    // ===== КНОПКИ =====
    const btnClimb = document.getElementById('btnClimb');
    const btnChoose = document.getElementById('btnChoose');
    const btnStats = document.getElementById('btnStats');
    const btnSave = document.getElementById('btnSave');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('towerModal');
    const statsModalClose = document.getElementById('statsModalClose');
    const statsModalOverlay = document.getElementById('statsModal');
    
    console.log('Кнопки найдены:', {
        btnClimb: !!btnClimb,
        btnChoose: !!btnChoose,
        btnStats: !!btnStats,
        btnSave: !!btnSave
    });
    
    if (btnClimb) {
        btnClimb.addEventListener('click', () => {
            console.log('Клик ВЗОБРАТЬСЯ');
            game.climb();
        });
    }
    
    if (btnChoose) {
        btnChoose.addEventListener('click', () => {
            console.log('Клик ВЫБРАТЬ БАШНЮ');
            renderModal(game);
            openModal();
        });
    }
    
    if (btnStats) {
        btnStats.addEventListener('click', () => {
            console.log('Клик СТАТИСТИКА');
            openStatsModal();
        });
    }
    
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            console.log('Клик СОХРАНИТЬ');
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
            saveGame(game);
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });
    }
    
    if (statsModalClose) {
        statsModalClose.addEventListener('click', closeStatsModal);
    }
    
    if (statsModalOverlay) {
        statsModalOverlay.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeStatsModal();
        });
    }
    
    // Переключение миров в модальном окне
    document.querySelectorAll('.world-tab-modal').forEach(tab => {
        tab.addEventListener('click', () => {
            selectWorldFromModal(tab.dataset.world);
        });
    });
    
    // Клавиши
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            game.climb();
        } else if (e.key === '2') {
            renderModal(game);
            openModal();
        } else if (e.key === '3') {
            openStatsModal();
        } else if (e.key === '4') {
            document.getElementById('btnSave')?.click();
        } else if (e.key === 'Escape') {
            closeModal();
            closeStatsModal();
        }
    });
    
    // Авто-обновление UI
    setInterval(() => {
        if (game) game.updateUI();
    }, 100);
    
    console.log('✅ Игра загружена!');
});
