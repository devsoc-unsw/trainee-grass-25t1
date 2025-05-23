import {
  getUserAndStoreStats,
  unlockAvatar,
  unlockBackground,
  updateUserXPAndLevel,
} from "../helper/authHelper";
import { generateToken } from "../helper/tokenHelper";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authRegister(leetcodeSessionCookie: string) {
  const userData = await getUserAndStoreStats(leetcodeSessionCookie);

  if (!userData) {
    throw {
      status: 400,
      message: "Invalid LeetCode session. Please check and try again.",
    };
  }

  const username = userData.username;
  const name = userData.profile?.realName?.trim() || username;

  // Check if the user is trying to sign in is an existing user
  const existingUser = await prisma.user.findFirst({
    where: { username },
  });

  if (existingUser) {
    const token = generateToken(existingUser.id);
    await updateUserXPAndLevel(existingUser.id);
    return {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        username: existingUser.username,
        activeAvatar: existingUser.activeAvatarName,
        activeBackground: existingUser.activeBackgroundName,
        leetcodeHandle: existingUser.leetcodeHandle,
      },
    };
  }

  // Get default avatar and background
  const defaultAvatar = await prisma.avatar.findFirst({
    where: {
      name: "default",
    },
  });
  const defaultBackground = await prisma.background.findFirst({
    where: {
      name: "mountain",
    },
  });

  // Create a new user
  const user = await prisma.user.create({
    data: {
      name,
      username,
      leetcodeHandle: username,
      activeAvatarName: defaultAvatar!.name,
      activeBackgroundName: defaultBackground!.name,
      totalSolved: userData.numSolved,
      easySolved: userData.easySolved,
      mediumSolved: userData.mediumSolved,
      hardSolved: userData.hardSolved,
    },
  });

  await unlockAvatar(user.id, defaultAvatar!.name);
  await unlockBackground(user.id, defaultBackground!.name);

  const token = generateToken(user.id);
  await updateUserXPAndLevel(user.id);
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      activeAvatar: user.activeAvatarName,
      activeBackground: user.activeBackgroundName,
      leetcodeHandle: user.leetcodeHandle,
    },
  };
}
