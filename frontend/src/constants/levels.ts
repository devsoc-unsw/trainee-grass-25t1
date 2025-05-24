export const EASY_MULTIPLIER = 5;
export const MEDIUM_MULTIPLIER = 10;
export const HARD_MULTIPLIER = 20;

export const LEVEL_THRESHOLD = [
  { level: 1, xp: 0 }, // Starting level
  { level: 2, xp: 25 }, // 5 easy problems
  { level: 3, xp: 75 }, // 15 easy problems or 5 medium
  { level: 4, xp: 150 }, // 30 easy or 10 medium or 5 hard
  { level: 5, xp: 250 }, // 50 easy or mix of difficulties
  { level: 6, xp: 375 }, // Getting into intermediate territory
  { level: 7, xp: 525 },
  { level: 8, xp: 700 },
  { level: 9, xp: 900 },
  { level: 10, xp: 1125 }, // Major milestone - about 75 medium problems
  { level: 11, xp: 1375 },
  { level: 12, xp: 1650 },
  { level: 13, xp: 1950 },
  { level: 14, xp: 2275 },
  { level: 15, xp: 2625 }, // Another major milestone
  { level: 16, xp: 3000 },
  { level: 17, xp: 3400 },
  { level: 18, xp: 3825 },
  { level: 19, xp: 4275 },
  { level: 20, xp: 4750 }, // Getting serious - 100+ hard problems
  { level: 21, xp: 5250 },
  { level: 22, xp: 5775 },
  { level: 23, xp: 6325 },
  { level: 24, xp: 6900 },
  { level: 25, xp: 7500 }, // Halfway milestone
  { level: 26, xp: 8125 },
  { level: 27, xp: 8775 },
  { level: 28, xp: 9450 },
  { level: 29, xp: 10150 },
  { level: 30, xp: 10875 }, // Advanced user territory
  { level: 31, xp: 11625 },
  { level: 32, xp: 12400 },
  { level: 33, xp: 13200 },
  { level: 34, xp: 14025 },
  { level: 35, xp: 14875 },
  { level: 36, xp: 15750 },
  { level: 37, xp: 16650 },
  { level: 38, xp: 17575 },
  { level: 39, xp: 18525 },
  { level: 40, xp: 19500 }, // Expert level - 400+ medium problems
  { level: 41, xp: 20500 },
  { level: 42, xp: 21525 },
  { level: 43, xp: 22575 },
  { level: 44, xp: 23650 },
  { level: 45, xp: 24750 },
  { level: 46, xp: 25875 },
  { level: 47, xp: 27025 },
  { level: 48, xp: 28200 },
  { level: 49, xp: 29400 },
  { level: 50, xp: 30625 }, // Max level - requires solving most problems
];

export const LEVEL_THRESHOLD_ARRAY = LEVEL_THRESHOLD.map(
  (threshold) => threshold.xp
);
