/**
 * levels.js - Level designs for Level 1 (Hutan Pelita) & Level 2 (Gua Kristal)
 * SMK Plus Pelita Nusantara
 */

const GAME_LEVELS = [
  {
    id: 1,
    name: "Level 1: Hutan Pelita",
    width: 3200,
    height: 540,
    bgColor: "#0c4a6e",
    theme: "forest",
    playerStart: { x: 80, y: 380 },
    platforms: [
      // Main ground segments with small pits to jump over
      { x: 0, y: 460, w: 800, h: 80 },
      { x: 900, y: 460, w: 700, h: 80 },
      { x: 1720, y: 460, w: 680, h: 80 },
      { x: 2520, y: 460, w: 680, h: 80 },

      // Elevated floating platforms
      { x: 280, y: 360, w: 140, h: 24 },
      { x: 480, y: 280, w: 160, h: 24 },
      { x: 700, y: 340, w: 120, h: 24 },

      { x: 1040, y: 360, w: 140, h: 24 },
      { x: 1260, y: 280, w: 160, h: 24 },
      { x: 1480, y: 340, w: 140, h: 24 },

      { x: 1840, y: 340, w: 140, h: 24 },
      { x: 2040, y: 260, w: 160, h: 24 },
      { x: 2260, y: 340, w: 140, h: 24 },

      // High vantage ledges
      { x: 2620, y: 360, w: 140, h: 24 },
      { x: 2820, y: 280, w: 180, h: 24 }
    ],
    movingPlatforms: [
      { x: 800, y: 400, w: 90, h: 20, minX: 790, maxX: 890, speed: 1.2, dir: 1, axis: 'x' },
      { x: 1620, y: 420, w: 90, h: 20, minY: 300, maxY: 440, speed: 1.4, dir: 1, axis: 'y' },
      { x: 2410, y: 400, w: 90, h: 20, minX: 2400, maxX: 2510, speed: 1.5, dir: 1, axis: 'x' }
    ],
    // Minimum 10 coins required; placing 16 coins
    coins: [
      { x: 220, y: 420 },
      { x: 320, y: 320 },
      { x: 360, y: 320 },
      { x: 520, y: 240 },
      { x: 560, y: 240 },
      { x: 740, y: 300 },
      { x: 960, y: 420 },
      { x: 1080, y: 320 },
      { x: 1300, y: 240 },
      { x: 1340, y: 240 },
      { x: 1520, y: 300 },
      { x: 1780, y: 420 },
      { x: 1880, y: 300 },
      { x: 2080, y: 220 },
      { x: 2120, y: 220 },
      { x: 2860, y: 240 }
    ],
    // Minimum 3 obstacle types: Slime, Spikes, Moving platforms (and pit hazards)
    spikes: [
      { x: 820, y: 520 }, // in pit 1
      { x: 1140, y: 436 },
      { x: 1960, y: 436 },
      { x: 2700, y: 436 }
    ],
    enemies: [
      { type: 'slime', x: 420, y: 432, minX: 300, maxX: 600, speed: 1.0, dir: 1 },
      { type: 'slime', x: 1180, y: 432, minX: 1000, maxX: 1400, speed: 1.2, dir: -1 },
      { type: 'slime', x: 2000, y: 432, minX: 1800, maxX: 2200, speed: 1.1, dir: 1 },
      { type: 'bat', x: 1400, y: 220, minX: 1250, maxX: 1550, speed: 1.5, dir: 1, baseY: 220 }
    ],
    interactables: [
      { type: 'heart', x: 540, y: 240 },
      { type: 'chest', x: 2300, y: 308, opened: false },
      { type: 'goal', x: 3040, y: 412, kind: 'flag' }
    ]
  },
  {
    id: 2,
    name: "Level 2: Gua Kristal",
    width: 3600,
    height: 540,
    bgColor: "#1e1b4b",
    theme: "cave",
    playerStart: { x: 80, y: 380 },
    platforms: [
      // Cavern floor segments
      { x: 0, y: 460, w: 750, h: 80 },
      { x: 880, y: 460, w: 650, h: 80 },
      { x: 1650, y: 460, w: 700, h: 80 },
      { x: 2480, y: 460, w: 600, h: 80 },
      { x: 3200, y: 460, w: 400, h: 80 },

      // Cave crystal platforms
      { x: 240, y: 350, w: 130, h: 24 },
      { x: 440, y: 270, w: 150, h: 24 },
      { x: 640, y: 340, w: 120, h: 24 },

      { x: 960, y: 350, w: 130, h: 24 },
      { x: 1160, y: 260, w: 160, h: 24 },
      { x: 1380, y: 340, w: 130, h: 24 },

      { x: 1760, y: 350, w: 140, h: 24 },
      { x: 1980, y: 250, w: 160, h: 24 },
      { x: 2180, y: 340, w: 140, h: 24 },

      { x: 2600, y: 350, w: 140, h: 24 },
      { x: 2800, y: 270, w: 160, h: 24 },
      { x: 3020, y: 350, w: 140, h: 24 }
    ],
    movingPlatforms: [
      { x: 760, y: 420, w: 90, h: 20, minX: 755, maxX: 875, speed: 1.6, dir: 1, axis: 'x' },
      { x: 1540, y: 380, w: 90, h: 20, minY: 260, maxY: 440, speed: 1.8, dir: 1, axis: 'y' },
      { x: 2360, y: 400, w: 90, h: 20, minX: 2355, maxX: 2475, speed: 2.0, dir: 1, axis: 'x' },
      { x: 3090, y: 410, w: 90, h: 20, minX: 3085, maxX: 3195, speed: 1.7, dir: 1, axis: 'x' }
    ],
    // 20 coins
    coins: [
      { x: 180, y: 420 },
      { x: 280, y: 310 },
      { x: 480, y: 230 },
      { x: 520, y: 230 },
      { x: 680, y: 300 },
      { x: 920, y: 420 },
      { x: 1000, y: 310 },
      { x: 1200, y: 220 },
      { x: 1240, y: 220 },
      { x: 1420, y: 300 },
      { x: 1700, y: 420 },
      { x: 1800, y: 310 },
      { x: 2020, y: 210 },
      { x: 2060, y: 210 },
      { x: 2220, y: 300 },
      { x: 2540, y: 420 },
      { x: 2640, y: 310 },
      { x: 2840, y: 230 },
      { x: 2880, y: 230 },
      { x: 3060, y: 310 }
    ],
    spikes: [
      { x: 400, y: 436 },
      { x: 1100, y: 436 },
      { x: 1880, y: 436 },
      { x: 2720, y: 436 },
      { x: 2920, y: 436 }
    ],
    enemies: [
      { type: 'slime', x: 350, y: 432, minX: 250, maxX: 550, speed: 1.3, dir: 1 },
      { type: 'bat', x: 680, y: 240, minX: 580, maxX: 780, speed: 1.8, dir: 1, baseY: 240 },
      { type: 'slime', x: 1250, y: 432, minX: 1050, maxX: 1450, speed: 1.4, dir: -1 },
      { type: 'bat', x: 1300, y: 190, minX: 1180, maxX: 1420, speed: 2.0, dir: 1, baseY: 190 },
      { type: 'slime', x: 2050, y: 432, minX: 1950, maxX: 2300, speed: 1.5, dir: 1 },
      { type: 'bat', x: 2100, y: 180, minX: 1950, maxX: 2250, speed: 1.8, dir: -1, baseY: 180 },
      { type: 'slime', x: 2800, y: 432, minX: 2650, maxX: 2950, speed: 1.4, dir: 1 }
    ],
    interactables: [
      { type: 'heart', x: 500, y: 230 },
      { type: 'chest', x: 1220, y: 228, opened: false },
      { type: 'heart', x: 2040, y: 210 },
      { type: 'chest', x: 2860, y: 238, opened: false },
      { type: 'goal', x: 3450, y: 408, kind: 'portal' }
    ]
  }
];
