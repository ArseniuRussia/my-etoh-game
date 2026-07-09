// data.js

// ===== ПОД-ТИРЫ СЛОЖНОСТЕЙ =====
const SubTiers = {
    'baseline': { range: [0.00, 0.00], label: 'Baseline', icon: '◆' },
    'bottom': { range: [0.01, 0.11], label: 'Bottom', icon: '◇' },
    'bottom-low': { range: [0.12, 0.22], label: 'Bottom-Low', icon: '◈' },
    'low': { range: [0.23, 0.33], label: 'Low', icon: '◆' },
    'low-mid': { range: [0.34, 0.44], label: 'Low-Mid', icon: '◇' },
    'mid': { range: [0.45, 0.55], label: 'Mid', icon: '◈' },
    'mid-high': { range: [0.56, 0.66], label: 'Mid-High', icon: '◆' },
    'high': { range: [0.67, 0.77], label: 'High', icon: '◇' },
    'high-peak': { range: [0.78, 0.88], label: 'High-Peak', icon: '◈' },
    'peak': { range: [0.89, 0.98], label: 'Peak', icon: '◆' },
    'skyline': { range: [0.99, 0.99], label: 'Skyline', icon: '★' }
};

// ===== ОСНОВНЫЕ СЛОЖНОСТИ (с числовыми значениями) =====
const DifficultyLevels = {
    'Effortless': 0.00,
    'Easy': 1.00,
    'Medium': 2.00,
    'Hard': 3.00,
    'Difficult': 4.00,
    'Challenging': 5.00,
    'Intense': 6.00,
    'Remorseless': 7.00,
    'Insane': 8.00,
    'Extreme': 9.00,
    'Terrifying': 10.00,
    'Catastrophic': 11.00
};

const DifficultyOrder = [
    'Effortless', 'Easy', 'Medium', 'Hard', 'Difficult',
    'Challenging', 'Intense', 'Remorseless', 'Insane',
    'Extreme', 'Terrifying', 'Catastrophic'
];

// ===== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПОД-ТИРА =====
function getSubTier(difficultyValue) {
    // Получаем дробную часть (0.00 - 0.99)
    const fractional = difficultyValue - Math.floor(difficultyValue);
    const rounded = Math.round(fractional * 100) / 100;
    
    for (const [key, tier] of Object.entries(SubTiers)) {
        const [min, max] = tier.range;
        if (rounded >= min && rounded <= max) {
            return tier;
        }
    }
    return SubTiers['baseline']; // fallback
}

// ===== ФУНКЦИЯ ДЛЯ ФОРМАТИРОВАНИЯ СЛОЖНОСТИ =====
function formatDifficultyWithSubTier(difficultyValue) {
    const mainValue = Math.floor(difficultyValue);
    const mainName = DifficultyOrder[mainValue] || 'Unknown';
    const subTier = getSubTier(difficultyValue);
    return `${mainName} ${subTier.icon} ${subTier.label} (${difficultyValue.toFixed(2)})`;
}

// ===== ДАННЫЕ БАШЕН =====
const EToHData = {
    rings: [
        {
            id: 1,
            name: "Ring 1",
            difficulty: "Effortless - Easy",
            difficultyMin: 0.00,
            difficultyMax: 1.00,
            towers: [
                { name: "Tower of Anger", floors: 10, difficulty: "Effortless", difficultyValue: 0.00 },
                { name: "Tower of Madness", floors: 15, difficulty: "Easy", difficultyValue: 1.00 },
                { name: "Tower of Despair", floors: 20, difficulty: "Easy", difficultyValue: 1.00 }
            ]
        },
        {
            id: 2,
            name: "Ring 2",
            difficulty: "Easy - Medium",
            difficultyMin: 1.00,
            difficultyMax: 2.00,
            towers: [
                { name: "Tower of Sadness", floors: 15, difficulty: "Easy", difficultyValue: 1.00 },
                { name: "Tower of Fear", floors: 20, difficulty: "Medium", difficultyValue: 2.00 },
                { name: "Tower of Pain", floors: 25, difficulty: "Medium", difficultyValue: 2.00 },
                { name: "Tower of Suffering", floors: 30, difficulty: "Hard", difficultyValue: 3.00 }
            ]
        },
        {
            id: 3,
            name: "Ring 3",
            difficulty: "Medium - Hard",
            difficultyMin: 2.00,
            difficultyMax: 3.00,
            towers: [
                { name: "Tower of Isolation", floors: 20, difficulty: "Medium", difficultyValue: 2.00 },
                { name: "Tower of Darkness", floors: 25, difficulty: "Hard", difficultyValue: 3.00 },
                { name: "Tower of Agony", floors: 35, difficulty: "Difficult", difficultyValue: 4.00 }
            ]
        },
        {
            id: 4,
            name: "Ring 4",
            difficulty: "Hard - Difficult",
            difficultyMin: 3.00,
            difficultyMax: 4.00,
            towers: [
                { name: "Tower of Corruption", floors: 25, difficulty: "Hard", difficultyValue: 3.00 },
                { name: "Tower of Malice", floors: 30, difficulty: "Difficult", difficultyValue: 4.00 },
                { name: "Tower of Wrath", floors: 40, difficulty: "Challenging", difficultyValue: 5.00 }
            ]
        },
        {
            id: 5,
            name: "Ring 5",
            difficulty: "Difficult - Challenging",
            difficultyMin: 4.00,
            difficultyMax: 5.00,
            towers: [
                { name: "Tower of Turmoil", floors: 30, difficulty: "Difficult", difficultyValue: 4.00 },
                { name: "Tower of Torment", floors: 35, difficulty: "Challenging", difficultyValue: 5.00 },
                { name: "Tower of Rage", floors: 45, difficulty: "Intense", difficultyValue: 6.00 }
            ]
        },
        {
            id: 6,
            name: "Ring 6",
            difficulty: "Challenging - Intense",
            difficultyMin: 5.00,
            difficultyMax: 6.00,
            towers: [
                { name: "Tower of Chaos", floors: 35, difficulty: "Challenging", difficultyValue: 5.00 },
                { name: "Tower of Fury", floors: 40, difficulty: "Intense", difficultyValue: 6.00 },
                { name: "Tower of Vengeance", floors: 50, difficulty: "Remorseless", difficultyValue: 7.00 }
            ]
        },
        {
            id: 7,
            name: "Ring 7",
            difficulty: "Intense - Remorseless",
            difficultyMin: 6.00,
            difficultyMax: 7.00,
            towers: [
                { name: "Tower of Annihilation", floors: 40, difficulty: "Intense", difficultyValue: 6.00 },
                { name: "Tower of Destruction", floors: 45, difficulty: "Remorseless", difficultyValue: 7.00 },
                { name: "Tower of Oblivion", floors: 55, difficulty: "Insane", difficultyValue: 8.00 }
            ]
        },
        {
            id: 8,
            name: "Ring 8",
            difficulty: "Remorseless - Insane",
            difficultyMin: 7.00,
            difficultyMax: 8.00,
            towers: [
                { name: "Tower of Desolation", floors: 45, difficulty: "Remorseless", difficultyValue: 7.00 },
                { name: "Tower of Extinction", floors: 50, difficulty: "Insane", difficultyValue: 8.00 },
                { name: "Tower of Apocalypse", floors: 60, difficulty: "Extreme", difficultyValue: 9.00 }
            ]
        },
        {
            id: 9,
            name: "Ring 9",
            difficulty: "Insane - Extreme",
            difficultyMin: 8.00,
            difficultyMax: 9.00,
            towers: [
                { name: "Tower of Doom", floors: 50, difficulty: "Insane", difficultyValue: 8.00 },
                { name: "Tower of Cataclysm", floors: 55, difficulty: "Extreme", difficultyValue: 9.00 },
                { name: "Tower of Armageddon", floors: 65, difficulty: "Terrifying", difficultyValue: 10.00 }
            ]
        }
    ],
    zones: [
        {
            id: 1,
            name: "Zone 1",
            difficulty: "Hard - Intense",
            difficultyMin: 3.00,
            difficultyMax: 6.00,
            towers: [
                { name: "Tower of Frost", floors: 30, difficulty: "Hard", difficultyValue: 3.00 },
                { name: "Tower of Flame", floors: 35, difficulty: "Intense", difficultyValue: 6.00 },
                { name: "Tower of Storm", floors: 40, difficulty: "Remorseless", difficultyValue: 7.00 }
            ]
        },
        {
            id: 2,
            name: "Zone 2",
            difficulty: "Intense - Remorseless",
            difficultyMin: 6.00,
            difficultyMax: 7.00,
            towers: [
                { name: "Tower of Thunder", floors: 35, difficulty: "Intense", difficultyValue: 6.00 },
                { name: "Tower of Lightning", floors: 40, difficulty: "Remorseless", difficultyValue: 7.00 },
                { name: "Tower of Quake", floors: 45, difficulty: "Insane", difficultyValue: 8.00 }
            ]
        },
        {
            id: 3,
            name: "Zone 3",
            difficulty: "Remorseless - Insane",
            difficultyMin: 7.00,
            difficultyMax: 8.00,
            towers: [
                { name: "Tower of Eclipse", floors: 40, difficulty: "Remorseless", difficultyValue: 7.00 },
                { name: "Tower of Shadow", floors: 45, difficulty: "Insane", difficultyValue: 8.00 },
                { name: "Tower of Nightmare", floors: 50, difficulty: "Extreme", difficultyValue: 9.00 }
            ]
        },
        {
            id: 4,
            name: "Zone 4",
            difficulty: "Insane - Extreme",
            difficultyMin: 8.00,
            difficultyMax: 9.00,
            towers: [
                { name: "Tower of Abyss", floors: 45, difficulty: "Insane", difficultyValue: 8.00 },
                { name: "Tower of Void", floors: 50, difficulty: "Extreme", difficultyValue: 9.00 },
                { name: "Tower of Eternity", floors: 55, difficulty: "Terrifying", difficultyValue: 10.00 }
            ]
        },
        {
            id: 5,
            name: "Zone 5",
            difficulty: "Extreme - Terrifying",
            difficultyMin: 9.00,
            difficultyMax: 10.00,
            towers: [
                { name: "Tower of Infinity", floors: 50, difficulty: "Extreme", difficultyValue: 9.00 },
                { name: "Tower of Universe", floors: 55, difficulty: "Terrifying", difficultyValue: 10.00 },
                { name: "Tower of Cosmos", floors: 60, difficulty: "Catastrophic", difficultyValue: 11.00 }
            ]
        },
        {
            id: 6,
            name: "Zone 6",
            difficulty: "Terrifying - Catastrophic",
            difficultyMin: 10.00,
            difficultyMax: 11.00,
            towers: [
                { name: "Tower of Existence", floors: 55, difficulty: "Terrifying", difficultyValue: 10.00 },
                { name: "Tower of Reality", floors: 60, difficulty: "Catastrophic", difficultyValue: 11.00 }
            ]
        },
        {
            id: 7,
            name: "Zone 7",
            difficulty: "Catastrophic",
            difficultyMin: 11.00,
            difficultyMax: 11.00,
            towers: [
                { name: "Tower of Genesis", floors: 60, difficulty: "Catastrophic", difficultyValue: 11.00 },
                { name: "Tower of Apotheosis", floors: 65, difficulty: "Catastrophic", difficultyValue: 11.00 }
            ]
        },
        {
            id: 8,
            name: "Zone 8",
            difficulty: "Catastrophic",
            difficultyMin: 11.00,
            difficultyMax: 11.00,
            towers: [
                { name: "Tower of Divinity", floors: 65, difficulty: "Catastrophic", difficultyValue: 11.00 },
                { name: "Tower of Transcendence", floors: 70, difficulty: "Catastrophic", difficultyValue: 11.00 }
            ]
        },
        {
            id: 9,
            name: "Zone 9",
            difficulty: "Catastrophic",
            difficultyMin: 11.00,
            difficultyMax: 11.00,
            towers: [
                { name: "Tower of Omniscience", floors: 70, difficulty: "Catastrophic", difficultyValue: 11.00 },
                { name: "Tower of Omnipotence", floors: 75, difficulty: "Catastrophic", difficultyValue: 11.00 }
            ]
        },
        {
            id: 10,
            name: "Zone 10",
            difficulty: "Catastrophic",
            difficultyMin: 11.00,
            difficultyMax: 11.00,
            towers: [
                { name: "Tower of The Absolute", floors: 80, difficulty: "Catastrophic", difficultyValue: 11.00 }
            ]
        }
    ]
};

// Делаем функции глобальными
window.SubTiers = SubTiers;
window.getSubTier = getSubTier;
window.formatDifficultyWithSubTier = formatDifficultyWithSubTier;
window.DifficultyOrder = DifficultyOrder;
window.DifficultyLevels = DifficultyLevels;
window.EToHData = EToHData;
