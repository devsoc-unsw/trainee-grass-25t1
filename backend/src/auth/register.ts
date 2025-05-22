import { 
  getUser,
  storeLeetcodeStats,
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
  const userData = await getUser(leetcodeSessionCookie);

  if (!userData) {
    throw {
      status: 400,
      message: "Invalid LeetCode session. Please check and try again.",
    }
  }

  const username = userData.username;
  const name = userData.profile?.realName?.trim() || username;
  const password = crypto.randomUUID();
  const hashedPassword = getHash(password);

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
      username,
      password: hashedPassword,
      leetcodeHandle: username,
      activeAvatarId: defaultAvatar.id,
      activeBackgroundId: defaultBackground.id,
    },
  });

  await storeLeetcodeStats(user.id, userData, leetcodeSessionCookie);

  // XP and levels handling
  updateUserXPAndLevel(user.id);


  const token = generateToken(user.id);

  return {
    token,
    userId: user.id,
    name: user.name,
    username: user.username,
    activeAvatar: user.activeAvatarId,
    activeBackground: user.activeBackgroundId,
    leetcodeHandle: user.leetcodeHandle,
  }
}
