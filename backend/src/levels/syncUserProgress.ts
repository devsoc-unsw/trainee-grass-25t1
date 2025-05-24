import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { calculateXP, getLevelFromXP } from "../helper/levelHelper";

const prisma = new PrismaClient();

const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

/**
 * Function to fetch leetcode stats
 * @param handle
 * @returns
 */
async function fetchLeetcodeStats(handle: string) {
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
export async function syncUserProgress(userId: string, leetcodeHandle: string) {
  const stats = await fetchLeetcodeStats(leetcodeHandle);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  const diff = stats?.totalSolved - user.totalSolved;
  if (diff <= 0) {
    return { message: "No new problems solved." };
  }

  const newXP = calculateXP(
    stats?.easySolved,
    stats?.mediumSolved,
    stats?.hardSolved
  );

  const newLevel = getLevelFromXP(newXP);

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
