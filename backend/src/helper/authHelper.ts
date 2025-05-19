import { getHash } from "./util";
import axios from "axios";

import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
const prisma = new PrismaClient();

// Other constants
const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

export async function checkEmailExists(email: string): Promise<boolean> {
  const res = await prisma.user
    .findFirst({
      where: {
        email: email,
      },
    })
    .catch((e) => {
      console.error(e.message);
    });

  if (res === null) return false;
  else return true;
}

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

export async function verifyLogin(
  email: string,
  password: string
): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user === null) return false;

  // If password is correct, reset the remainingLoginAttempts to 3
  // If the password is incorrect, subtract the remainingLoginAttempts by 1
  if (user.password === getHash(password)) {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        remainingLoginAttempts: 3,
      },
    });

    return true;
  } else {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        remainingLoginAttempts: {
          decrement: 1,
        },
      },
    });

    return false;
  }
}

export async function checkBlockedAccount(email: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user === null) return false;

  if (user.remainingLoginAttempts === 0) return true;
  else return false;
}

export async function loginLeetCode(username: string, password: string) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto('https://leetcode.com/accounts/login/', {
    waitUntil: 'networkidle2',
  });
  
  await page.waitForSelector('#id_login');
  await page.type('#id_login', username);
  
  await page.waitForSelector('#id_password');
  await page.type('#id_password', password);
  
  await Promise.all([
    page.click('button[type=submit]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  const cookies = await page.cookies();
  await browser.close();

  const leetcodeSession= cookies.find(c => c.name === 'LEETCODE_SESSION');
  const csrfToken = cookies.find(c => c.name === 'csrfToken');

  if (!leetcodeSession || !csrfToken) {
    throw {
      status: 401,
      message: "Failed to log in to LeetCode. Check credentials.",
    };
  }

  return {
    leetcodeSession: leetcodeSession.value,
    csrfToken: csrfToken.value,
  }
}
const isDev = process.env.NODE_ENV !== "production";

export async function validateLeetcodeSession(leetcodeSessionCookie: string): Promise<any | null> {
  //TODO: Remove after testing stages
  if (isDev) {
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

    await prisma.leetCodeStats.create({
      data: {
        userId,
        totalSolved: statsData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === "All")?.count || 0,
        easySolved: statsData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === "Easy")?.count || 0,
        mediumSolved: statsData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === "Medium")?.count || 0,
        hardSolved: statsData.submitStats.acSubmissionNum.find((item: any) => item.difficulty === "Hard")?.count || 0,
        ranking: statsData.profile.ranking || 0,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error("Error storing LeetCode stats from validated user", error);
  }
}
