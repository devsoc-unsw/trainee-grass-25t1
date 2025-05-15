import { 
  checkUsernameExists,
  validateLeetcodeHandle,
  storeLeetcodeStats
} from "../helper/authHelper";
import { generateToken } from "../helper/tokenHelper";
import { getHash } from "../helper/util";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authRegister(
  leetcodeHandle: string,
  leetcodeSessionCookie: string
) {
  // Error Handling
  if (leetcodeHandle && leetcodeHandle.trim() != '') {
    throw {
      status: 400,
      message: "LeetCode handle not found. Please provide a valid username.",
    }
  }

  if (!leetcodeSessionCookie || leetcodeSessionCookie.trim() === '') {
    throw{
      status: 400,
      message: "LeetCode session cookie is required.",
    }
  }

  const userData = await validateLeetcodeHandle(leetcodeHandle, leetcodeSessionCookie);

  if (!userData) {
    throw {
      status: 400,
      message: "Invalid LeetCode session or handle. Please check and try again.",
    }
  }

  const username = userData.username;
  const name = userData.profile?.realName?.trim() || username;
  const email = `${username}@leetcode.local`;
  const password = crypto.randomUUID();
  const hashedPassword = getHash(password);

  if ( await checkUsernameExists(username)) {
    throw {
      status: 400,
      message: "This LeetCode account is already registered.",
    }
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      leetcodeHandle: leetcodeHandle,
      activeAvatarId: 'default',
      activeBackgroundId: 'default',
    },
  });

  await storeLeetcodeStats(user.id, leetcodeHandle, leetcodeSessionCookie);

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      activeAvatar: "default-avatar-id",
      activeBackground: "default-background-id",
      leetcodeHandle: user.leetcodeHandle,
    }
  }
}
