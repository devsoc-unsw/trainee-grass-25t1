import axios from "axios";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Constants
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
