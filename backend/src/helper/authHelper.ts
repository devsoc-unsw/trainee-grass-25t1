import { getHash } from "./util";
import axios from "axios";

import { PrismaClient } from "@prisma/client";
import { getUserById } from "./userHelper";
const prisma = new PrismaClient();

// Other constants
const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';


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
export async function getUser(leetcodeSessionCookie: string): Promise<any | null> {
  //TODO: Remove after testing stages
  if (leetcodeSessionCookie === 'MOCK_COOKIE') {
    // Simulate a successful response
    return {
      username: "mockUser",
      profile: {
        realName: "Mock Real Name",
        userAvatar: "https://example.com/mock-avatar.png",
        school: "Mock University"
      }
    };
  }
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            userAvatar
            school
          }
        }
      }
    `;

    const meRes = await axios.get("https://leetcode.com/api/problems/algorithms/", {
      headers: {
        Cookie: `LEETCODE_SESSION=${leetcodeSessionCookie}`,
      },
    });

    const username = meRes.data.user_name;
    if (!username) return null;

    const response = await axios.post(
      LEETCODE_API_ENDPOINT,
      {
        query,
        variables: { username }, // pass username as variable
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `LEETCODE_SESSION=${leetcodeSessionCookie}`,
        },
        withCredentials: true,
      }
    );
    // Check user exists in leetCode
    const user = response.data.data?.matchedUser;
    if (!user) {
      return null;
    }
    
    return user;
  } catch(error) {
    console.error("Error validating user in leetcode", error);
    return null;
  }
}

export async function storeLeetcodeStats(
  userId: string,
  validatedUser: any,
  leetcodeSessionCookie: string
) {
  try {
    if (!validatedUser || !validatedUser.username) return;
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
          }
        }
      }
    `;

    const response = await axios.post(
      LEETCODE_API_ENDPOINT,
      {
        query,
        variables: { username: validatedUser.username },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `LEETCODE_SESSION=${leetcodeSessionCookie}`,
        },
        withCredentials: true,
      }
    );

    const statsData = response.data?.data?.matchedUser;
    if (!statsData) return;

    const findCount = (difficulty: string) =>
      statsData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === difficulty)?.count || 0;

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalSolved: findCount("All"),
        easySolved: findCount("Easy"),
        mediumSolved: findCount("Medium"),
        hardSolved: findCount("Hard"),
        ranking: statsData.profile.ranking || 0,
        leetcodeLastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("Error storing LeetCode stats from validated user", error);
  }
}

///////////////////////// XP and level handling /////////////////////////
export function calculateXP(easySolved: number, mediumSolved: number, hardSolved: number): number {
  const easyXP = 5;
  const mediumXP = 10;
  const hardXP = 20;

  const xp = (easySolved || 0) * easyXP + (mediumSolved || 0) * mediumXP + (hardSolved || 0)* hardXP;

  return xp;
}

export async function updateUserXPAndLevel(userId: string) {
  const user = await getUserById(userId);

  if (!user) return 0;

  const xp = calculateXP(user.easySolved, user.mediumSolved, user.hardSolved);
  
  await prisma.user.update({
    where: { id: userId },
    data: { xp },
  });

  const level = getLevelFromXP(xp);

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp,
      levels: level,
    },
  });
}

// level handling
const levelThresholds = [
  { level: 1, xp: 0 },
  { level: 2, xp: 10 },
  { level: 3, xp: 30 },
  { level: 4, xp: 55 },
  { level: 5, xp: 80 },
];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (const threshold of levelThresholds) {
    if (xp >= threshold.xp) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
}
