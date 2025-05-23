import axios from "axios";

import { PrismaClient } from "@prisma/client";
import { getUserById } from "./userHelper";
import { LEVEL_THRESHOLD } from "../constants/levels";
const prisma = new PrismaClient();

// Other constants
const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

export async function checkUsernameExists(username: string): Promise<boolean> {
  const res = await prisma.user
    .findFirst({
      where: {
        username: username,
      },
    })
    .catch((e) => {
      console.error(e.message);
    });

  if (res === null) return false;
  else return true;
}

export async function checkBlockedAccount(username: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (user === null) return false;

  if (user.remainingLoginAttempts === 0) return true;
  else return false;
}

///////////////////////// LeetCode handling /////////////////////////

export async function getUserAndStoreStats(
  leetcodeSessionCookie: string
): Promise<any | null> {
  try {
    // Validate leetcodeSessionCookie
    const mRes = await axios.get(
      "https://leetcode.com/api/problems/algorithms/",
      {
        headers: {
          Cookie: `LEETCODE_SESSION = ${leetcodeSessionCookie}`,
        },
      }
    );

    const username = mRes.data.user_name;
    if (!username) return null;

    // Get user data from LeetCode
    const combinedQuery = `
    query combinedUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          school
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

    const response = await axios.post(
      LEETCODE_API_ENDPOINT,
      {
        query: combinedQuery,
        variables: { username },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `LEETCODE_SESSION=${leetcodeSessionCookie}`,
        },
        withCredentials: true,
      }
    );

    // Return early if no user data is found from the leetcode API
    const data = response.data.data?.matchedUser;
    if (!data) {
      return null;
    }

    const userProfile = data.profile;
    const findCount = (difficulty: string) =>
      data.submitStats?.acSubmissionNum?.find(
        (item: any) => item.difficulty === difficulty
      )?.count || 0;
    const stats = {
      totalSolved: findCount("All"),
      easySolved: findCount("Easy"),
      mediumSolved: findCount("Medium"),
      hardSolved: findCount("Hard"),
    };

    return {
      username: data.username,
      realName: userProfile?.realName?.trim() || data.username,
      userAvatar: userProfile?.userAvatar,
      ...stats,
    };
  } catch (error) {
    console.error("Error fetching user in leetcode", error);
    return null;
  }
}

///////////////////////// XP and level handling /////////////////////////
export function calculateXP(
  easySolved: number,
  mediumSolved: number,
  hardSolved: number
): number {
  const easyXP = 5;
  const mediumXP = 10;
  const hardXP = 20;

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

// TODO: UPSERT ALL AVATARS AND BACKGROUNDS
export async function upsertDefaults() {
  const avatars = [
    {
      name: "default",
      imageUrl: "/sprites/default.png",
      unlockRequirement: 0,
    },
  ];

  for (const avatar of avatars) {
    await prisma.avatar.upsert({
      where: { name: avatar.name },
      update: {},
      create: avatar,
    });
  }

  // Default Backgrounds
  const backgrounds = [
    {
      name: "mountain",
      imageUrl: "/backgrounds/mountain.png",
      unlockRequirement: 0,
    },
  ];

  for (const background of backgrounds) {
    await prisma.background.upsert({
      where: { name: background.name },
      update: {},
      create: background,
    });
  }
}

export async function unlockAvatar(userId: string, avatar: string) {
  const targetAvatar = await prisma.avatar.findUnique({
    where: { name: avatar },
  });

  if (!targetAvatar) return null;

  await prisma.avatarUnlocked.upsert({
    where: {
      userId_avatarName: {
        userId,
        avatarName: targetAvatar.name,
      },
    },
    update: {},
    create: {
      userId,
      avatarName: targetAvatar.name,
    },
  });

  return targetAvatar;
}

export async function unlockBackground(userId: string, background: string) {
  const targetBackground = await prisma.background.findUnique({
    where: { name: background },
  });

  if (!targetBackground) return null;

  await prisma.backgroundUnlocked.upsert({
    where: {
      userId_backgroundName: {
        userId,
        backgroundName: targetBackground.name,
      },
    },
    update: {},
    create: {
      userId,
      backgroundName: targetBackground.name,
    },
  });

  return targetBackground;
}
