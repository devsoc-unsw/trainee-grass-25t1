import { PrismaClient } from "@prisma/client";
import { generateToken } from "./tokenHelper";
import { calculateXP, getLevelFromXP } from "./levelHelper";
import { unlockAvatars, unlockBackgrounds } from "./spriteHelper";
const prisma = new PrismaClient();

export async function getUserById(id: string) {
  // Prisma Queries
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
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
}

export async function getUserByUsername(username: string) {
  // Prisma Queries
  return await prisma.user.findUnique({
    where: {
      username: username,
    },
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
}

type UserData = {
  name: string;
  username: string;
  leetcodeHandle: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

export async function createNewUser({
  name,
  username,
  leetcodeHandle,
  totalSolved,
  easySolved,
  mediumSolved,
  hardSolved,
}: UserData) {
  // Create a new user
  const newUserXP = calculateXP(easySolved, mediumSolved, hardSolved);
  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      leetcodeHandle,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      xp: newUserXP,
      levels: getLevelFromXP(newUserXP),
      activeAvatarName: "default",
      activeBackgroundName: "mountain",
    },
  });

  // Update user stats
  const avatarUnlocked = await unlockAvatars(newUser.id);
  const backgroundUnlocked = await unlockBackgrounds(newUser.id);

  return {
    id: newUser.id,
    name: newUser.name,
    username: newUser.username,
    totalSolved: newUser.totalSolved,
    easySolved: newUser.easySolved,
    mediumSolved: newUser.mediumSolved,
    hardSolved: newUser.hardSolved,
    streaks: newUser.streaks,
    levels: newUser.levels,
    xp: newUser.xp,
    activeAvatar: newUser.activeAvatarName,
    activeBackground: newUser.activeBackgroundName,
    leetcodeHandle: newUser.leetcodeHandle,
    avatarUnlocked: avatarUnlocked.map((avatar) => avatar.avatarName),
    backgroundUnlocked: backgroundUnlocked.map(
      (background) => background.backgroundName
    ),
  };
}

export async function updateUserAvatar(userId: string, avatarName: string) {
  // Update user's active avatar
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeAvatarName: avatarName,
    },
  });

  return updatedUser;
}

export async function updateUserBackground(
  userId: string,
  backgroundName: string
) {
  // Update user's active background
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeBackgroundName: backgroundName,
    },
  });

  return updatedUser;
}
