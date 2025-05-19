import { 
  checkUsernameExists,
  validateLeetcodeSession,
  storeLeetcodeStats,
} from "../helper/authHelper";
import { generateToken } from "../helper/tokenHelper";
import { getHash } from "../helper/util";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authRegister(
  leetcodeSessionCookie: string
) {
  // Error Handling
  const userData = await validateLeetcodeSession(leetcodeSessionCookie);

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

  const existingUser = await prisma.user.findFirst({
    where: { username },
  });
  if (existingUser) {
    const token = generateToken(existingUser.id);

    return {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        username: existingUser.username,
        activeAvatar: existingUser.activeAvatarId,
        activeBackground: existingUser.activeBackgroundId,
        leetcodeHandle: existingUser.leetcodeHandle,
      },
    };
  }

  const defaultAvatar = await prisma.avatar.upsert({
    where: { name: "default" },
    update: {},
    create: {
      name: "default",
      imageUrl: "/sprites/default.png",
      unlockRequirement: 0,
    },
  });
  
  const defaultBackground = await prisma.background.upsert({
    where: { name: "mountain" },
    update: {},
    create: {
      name: "mountain",
      imageUrl: "/backgrounds/mountain.png",
      unlockRequirement: 0,
    },
  });
  
  if (!defaultAvatar || !defaultBackground) {
    throw new Error("Default avatar or background not found");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      leetcodeHandle: username,
      activeAvatarId: defaultAvatar.id,
      activeBackgroundId: defaultBackground.id,
    },
  });

  await storeLeetcodeStats(user.id, userData, leetcodeSessionCookie);

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
