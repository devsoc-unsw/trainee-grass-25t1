import { 
  getUserAndStoreStats,
  updateUserXPAndLevel,
} from "../helper/authHelper";
import { generateToken } from "../helper/tokenHelper";
import { getHash } from "../helper/util";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authRegister(
  leetcodeSessionCookie: string
) {
  // Error Handling
  const userData = await getUserAndStoreStats(leetcodeSessionCookie);

  if (!userData) {
    throw {
      status: 400,
      message: "Invalid LeetCode session. Please check and try again.",
    }
  }

  const username = userData.username;
  const name = userData.profile?.realName?.trim() || username;

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
        activeAvatar: existingUser.activeAvatarId,
        activeBackground: existingUser.activeBackgroundId,
        leetcodeHandle: existingUser.leetcodeHandle,
      },
    };
  }

  const defaultAvatar = await prisma.avatar.findUnique({
    where: { name: "default" },
  });

  const defaultBackground = await prisma.background.findUnique({
    where: { name: "mountain" },
  });
  
  if (!defaultAvatar || !defaultBackground) {
    throw new Error("Default avatar or background not found");
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
      leetcodeHandle: username,
      activeAvatarId: defaultAvatar.id,
      activeBackgroundId: defaultBackground.id,
    },
  });

  // XP and levels handling
  await updateUserXPAndLevel(user.id);


  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      activeAvatar: user.activeAvatarId,
      activeBackground: user.activeBackgroundId,
      leetcodeHandle: user.leetcodeHandle,
    }
  }
}
