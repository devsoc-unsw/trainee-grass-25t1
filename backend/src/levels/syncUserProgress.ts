import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

const levelsMap: { [key: number]: number } = {
  1: 0,
  2: 10,
  3: 30,
  4: 55,
  5: 80,
};

/**
 * Function to fetch leetcode stats
 * @param handle
 * @returns
 */
async function fetchLeetcodeStats(
  handle: string,
  leetcodeSessionCookie: string
) {
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

  const variables = { username: handle };

  const response = await axios.post(
    LEETCODE_API_ENDPOINT,
    {
      query,
      variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: `LEETCODE_SESSION=${leetcodeSessionCookie}`,
      },
      withCredentials: true,
    }
  );

  const data = response.data.data?.matchedUser;
  if (!data) {
    return null;
  }

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

  console.log(stats);

  return stats;
}

/**
 * Function to sync the user's xp and level progress by
 * calculating xp gained based on difficulty of problems solved
 * @param userId
 * @param leetcodeHandle
 * @param leetcodeSessionCookie
 * @returns
 */
export async function syncUserProgress(
  userId: string,
  leetcodeHandle: string,
  leetcodeSessionCookie: string
) {
  const stats = await fetchLeetcodeStats(leetcodeHandle, leetcodeSessionCookie);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  const diff = stats?.totalSolved - user.totalSolved;
  if (diff <= 0) {
    return { message: "No new problems solved." };
  }

  const xpGained =
    (stats?.easySolved - user.easySolved) * 5 +
    (stats?.mediumSolved - user.mediumSolved) * 10 +
    (stats?.hardSolved - user.hardSolved) * 20;

  const newXP = user.xp + xpGained;

  let newLevel = user.levels;
  for (let lvl = user.levels + 1; levelsMap[lvl]; lvl++) {
    if (newXP >= levelsMap[lvl]) {
      newLevel = lvl;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalSolved: stats?.totalSolved,
      easySolved: stats?.easySolved,
      mediumSolved: stats?.mediumSolved,
      hardSolved: stats?.hardSolved,
      xp: newXP,
      levels: newLevel,
      leetcodeLastUpdated: new Date(),
    },
  });

  return {
    message: "User progress synced!",
    newTotalSolved: stats?.totalSolved,
    easySolved: stats?.easySolved,
    mediumSolved: stats?.mediumSolved,
    hardSolved: stats?.hardSolved,
    newXP,
    newLevel,
  };
}
