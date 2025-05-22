export const LEVEL_THRESHOLD = [
  { level: 1, xp: 0 },
  { level: 2, xp: 10 },
  { level: 3, xp: 30 },
  { level: 4, xp: 55 },
  { level: 5, xp: 80 },
];

export const LEVEL_THRESHOLD_ARRAY = LEVEL_THRESHOLD.map(
  (threshold) => threshold.xp
);
