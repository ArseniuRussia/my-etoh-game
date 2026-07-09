// data.js
const EToHData = {
    rings: [
        {
            id: 1,
            name: "Ring 1",
            difficulty: "Effortless - Easy",
            towers: [
                { name: "Tower of Anger", floors: 10, difficulty: "Effortless" },
                { name: "Tower of Madness", floors: 15, difficulty: "Easy" },
                { name: "Tower of Despair", floors: 20, difficulty: "Easy" }
            ]
        },
        {
            id: 2,
            name: "Ring 2",
            difficulty: "Easy - Medium",
            towers: [
                { name: "Tower of Sadness", floors: 15, difficulty: "Easy" },
                { name: "Tower of Fear", floors: 20, difficulty: "Medium" },
                { name: "Tower of Pain", floors: 25, difficulty: "Medium" },
                { name: "Tower of Suffering", floors: 30, difficulty: "Hard" }
            ]
        },
        {
            id: 3,
            name: "Ring 3",
            difficulty: "Medium - Hard",
            towers: [
                { name: "Tower of Isolation", floors: 20, difficulty: "Medium" },
                { name: "Tower of Darkness", floors: 25, difficulty: "Hard" },
                { name: "Tower of Agony", floors: 35, difficulty: "Difficult" }
            ]
        },
        {
            id: 4,
            name: "Ring 4",
            difficulty: "Hard - Difficult",
            towers: [
                { name: "Tower of Corruption", floors: 25, difficulty: "Hard" },
                { name: "Tower of Malice", floors: 30, difficulty: "Difficult" },
                { name: "Tower of Wrath", floors: 40, difficulty: "Challenging" }
            ]
        },
        {
            id: 5,
            name: "Ring 5",
            difficulty: "Difficult - Challenging",
            towers: [
                { name: "Tower of Turmoil", floors: 30, difficulty: "Difficult" },
                { name: "Tower of Torment", floors: 35, difficulty: "Challenging" },
                { name: "Tower of Rage", floors: 45, difficulty: "Intense" }
            ]
        },
        {
            id: 6,
            name: "Ring 6",
            difficulty: "Challenging - Intense",
            towers: [
                { name: "Tower of Chaos", floors: 35, difficulty: "Challenging" },
                { name: "Tower of Fury", floors: 40, difficulty: "Intense" },
                { name: "Tower of Vengeance", floors: 50, difficulty: "Remorseless" }
            ]
        },
        {
            id: 7,
            name: "Ring 7",
            difficulty: "Intense - Remorseless",
            towers: [
                { name: "Tower of Annihilation", floors: 40, difficulty: "Intense" },
                { name: "Tower of Destruction", floors: 45, difficulty: "Remorseless" },
                { name: "Tower of Oblivion", floors: 55, difficulty: "Insane" }
            ]
        },
        {
            id: 8,
            name: "Ring 8",
            difficulty: "Remorseless - Insane",
            towers: [
                { name: "Tower of Desolation", floors: 45, difficulty: "Remorseless" },
                { name: "Tower of Extinction", floors: 50, difficulty: "Insane" },
                { name: "Tower of Apocalypse", floors: 60, difficulty: "Extreme" }
            ]
        },
        {
            id: 9,
            name: "Ring 9",
            difficulty: "Insane - Extreme",
            towers: [
                { name: "Tower of Doom", floors: 50, difficulty: "Insane" },
                { name: "Tower of Cataclysm", floors: 55, difficulty: "Extreme" },
                { name: "Tower of Armageddon", floors: 65, difficulty: "Terrifying" }
            ]
        }
    ],
    zones: [
        {
            id: 1,
            name: "Zone 1",
            difficulty: "Hard - Intense",
            towers: [
                { name: "Tower of Frost", floors: 30, difficulty: "Hard" },
                { name: "Tower of Flame", floors: 35, difficulty: "Intense" },
                { name: "Tower of Storm", floors: 40, difficulty: "Remorseless" }
            ]
        },
        {
            id: 2,
            name: "Zone 2",
            difficulty: "Intense - Remorseless",
            towers: [
                { name: "Tower of Thunder", floors: 35, difficulty: "Intense" },
                { name: "Tower of Lightning", floors: 40, difficulty: "Remorseless" },
                { name: "Tower of Quake", floors: 45, difficulty: "Insane" }
            ]
        },
        {
            id: 3,
            name: "Zone 3",
            difficulty: "Remorseless - Insane",
            towers: [
                { name: "Tower of Eclipse", floors: 40, difficulty: "Remorseless" },
                { name: "Tower of Shadow", floors: 45, difficulty: "Insane" },
                { name: "Tower of Nightmare", floors: 50, difficulty: "Extreme" }
            ]
        },
        {
            id: 4,
            name: "Zone 4",
            difficulty: "Insane - Extreme",
            towers: [
                { name: "Tower of Abyss", floors: 45, difficulty: "Insane" },
                { name: "Tower of Void", floors: 50, difficulty: "Extreme" },
                { name: "Tower of Eternity", floors: 55, difficulty: "Terrifying" }
            ]
        },
        {
            id: 5,
            name: "Zone 5",
            difficulty: "Extreme - Terrifying",
            towers: [
                { name: "Tower of Infinity", floors: 50, difficulty: "Extreme" },
                { name: "Tower of Universe", floors: 55, difficulty: "Terrifying" },
                { name: "Tower of Cosmos", floors: 60, difficulty: "Catastrophic" }
            ]
        },
        {
            id: 6,
            name: "Zone 6",
            difficulty: "Terrifying - Catastrophic",
            towers: [
                { name: "Tower of Existence", floors: 55, difficulty: "Terrifying" },
                { name: "Tower of Reality", floors: 60, difficulty: "Catastrophic" }
            ]
        },
        {
            id: 7,
            name: "Zone 7",
            difficulty: "Catastrophic",
            towers: [
                { name: "Tower of Genesis", floors: 60, difficulty: "Catastrophic" },
                { name: "Tower of Apotheosis", floors: 65, difficulty: "Catastrophic" }
            ]
        },
        {
            id: 8,
            name: "Zone 8",
            difficulty: "Catastrophic",
            towers: [
                { name: "Tower of Divinity", floors: 65, difficulty: "Catastrophic" },
                { name: "Tower of Transcendence", floors: 70, difficulty: "Catastrophic" }
            ]
        },
        {
            id: 9,
            name: "Zone 9",
            difficulty: "Catastrophic",
            towers: [
                { name: "Tower of Omniscience", floors: 70, difficulty: "Catastrophic" },
                { name: "Tower of Omnipotence", floors: 75, difficulty: "Catastrophic" }
            ]
        },
        {
            id: 10,
            name: "Zone 10",
            difficulty: "Catastrophic",
            towers: [
                { name: "Tower of The Absolute", floors: 80, difficulty: "Catastrophic" }
            ]
        }
    ]
};
