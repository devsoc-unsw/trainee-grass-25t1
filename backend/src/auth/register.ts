import { getUserAndStoreStats } from "../helper/authHelper";
import { updateUserXPAndLevel } from "../helper/levelHelper";
import { unlockAvatars, unlockBackgrounds } from "../helper/spriteHelper";
import { generateToken } from "../helper/tokenHelper";

import { PrismaClient } from "@prisma/client";
import { createNewUser } from "../helper/userHelper";
const prisma = new PrismaClient();

export type UserResponse = {
  id: string;
  name: string;
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streaks: number;
  levels: number;
  xp: number;
  activeAvatar: string;
  activeBackground: string;
  leetcodeHandle: string;
  avatarUnlocked: string[];
  backgroundUnlocked: string[];
};

export async function authRegister(leetcodeSessionCookie: string) {
  const userData = await getUserAndStoreStats(leetcodeSessionCookie);

  if (!userData) {
    throw {
      status: 400,
      message: "Invalid LeetCode session. Please check and try again.",
    };
  }

  const username = userData.username;

  // Check if the user is trying to sign in is an existing user
  const existingUser = await prisma.user.findFirst({
    where: { username },
    include: {
      avatarUnlocked: {
        select: {
          avatarName: true,
        },
      },
      backgroundUnlocked: {
        select: {
          backgroundName: true,
        },
      },
    },
  });

  if (existingUser) {
    const token = await generateToken(existingUser.id);
    await updateUserXPAndLevel(existingUser.id);
    return {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        username: existingUser.username,
        totalSolved: existingUser.totalSolved,
        easySolved: existingUser.easySolved,
        mediumSolved: existingUser.mediumSolved,
        hardSolved: existingUser.hardSolved,
        streaks: existingUser.streaks,
        levels: existingUser.levels,
        xp: existingUser.xp,
        activeAvatar: existingUser.activeAvatarName,
        activeBackground: existingUser.activeBackgroundName,
        leetcodeHandle: existingUser.leetcodeHandle,
        avatarUnlocked: existingUser.avatarUnlocked.map(
          (avatar) => avatar.avatarName
        ),
        backgroundUnlocked: existingUser.backgroundUnlocked.map(
          (background) => background.backgroundName
        ),
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

  const name = userData.profile?.realName?.trim() || username;
  const newUser = await createNewUser({
    name,
    username,
    leetcodeHandle: username,
    totalSolved: userData.totalSolved,
    easySolved: userData.easySolved,
    mediumSolved: userData.mediumSolved,
    hardSolved: userData.hardSolved,
  });
  const token = await generateToken(newUser.id);

  return {
    token,
    user: newUser,
  };
}
