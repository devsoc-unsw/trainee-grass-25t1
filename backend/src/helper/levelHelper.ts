import { PrismaClient } from "@prisma/client";
import { getUserById } from "./userHelper";
import { EASY_MULTIPLIER, HARD_MULTIPLIER, LEVEL_THRESHOLD, MEDIUM_MULTIPLIER } from "../constants/levels";

const prisma = new PrismaClient();

export function calculateXP(
  easySolved: number,
  mediumSolved: number,
  hardSolved: number
): number {
  const easyXP = EASY_MULTIPLIER;
  const mediumXP = MEDIUM_MULTIPLIER;
  const hardXP = HARD_MULTIPLIER;

  const xp =
    (easySolved || 0) * easyXP +
    (mediumSolved || 0) * mediumXP +
    (hardSolved || 0) * hardXP;

  return xp;
}

export async function updateUserXPAndLevel(userId: string) {
  const user = await getUserById(userId);

  if (!user) return;

  const xp = calculateXP(user.easySolved, user.mediumSolved, user.hardSolved);
  const level = getLevelFromXP(xp);

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp,
      levels: level,
    },
  });
}

export function getLevelFromXP(xp: number): number {
  let start = 0,
    end = LEVEL_THRESHOLD.length - 1;
  let level = 1; // Default to level 1 if no threshold is met

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);

    if (LEVEL_THRESHOLD[mid].xp <= xp) {
      // User has enough XP for this level
      level = LEVEL_THRESHOLD[mid].level;
      start = mid + 1; // Check if they can reach an even higher level
    } else {
      // User doesn't have enough XP for this level
      end = mid - 1; // Check lower levels
    }
  }

  return level;
}

export async function getUserXP(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
    },
  });
  return user?.xp || 0;
}
