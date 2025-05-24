import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getLeaderboard(
  userId: string,
  page: number,
  size: number
) {
  // Get the data of the current user
  const rawCurrentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
      xp: true,
      activeAvatar: true,
    },
  });

  // Return early if user doesn't exist
  if (!rawCurrentUser) {
    throw { status: 400, message: "User not found." };
  }

  // Get the rank of the current user
  const currentUserRank = await prisma.$queryRaw<[{ rank: bigint }]>`
    SELECT COUNT(*) + 1 AS rank
    FROM "User" u1
    WHERE u1.xp > (
      SELECT u2.xp
      FROM "User" u2
      WHERE u2.id = ${userId}
    )
  `;
  const currentUserRankNumber = Number(currentUserRank[0].rank);

  // Get total count of users
  const totalEntries = await prisma.user.count();
  const totalPages = Math.ceil(totalEntries / size);

  // Calculate which page the current user's rank would be on
  const currentUserPage = Math.ceil(currentUserRankNumber / size);

  // Get the offset for pagination
  const skip = (page - 1) * size;

  // Get leaderboard data for the requested page
  const rawLeaderboard = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      xp: true,
      activeAvatar: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ xp: "desc" }, { username: "asc" }],
    skip,
    take: size,
  });

  // Build leaderboard data with ranks
  const leaderboard = rawLeaderboard.map((user, index) => ({
    rank: skip + index + 1,
    username: user.username,
    xp: user.xp,
    isCurrentUser: user.id === userId,
    avatar: user.activeAvatar.name,
  }));

  // Build current user object
  const currentUser = {
    rank: currentUserRankNumber,
    username: rawCurrentUser.username,
    xp: rawCurrentUser.xp,
    isCurrentUser: true,
    avatar: rawCurrentUser.activeAvatar.name,
    _links: {
      jumpToRankPage: {
        href: `/leaderboard?page=${currentUserPage}&size=${size}`,
      },
    },
  };

  return {
    meta: {
      page,
      size,
      totalPages,
      totalEntries,
    },
    data: {
      leaderboard,
      currentUser,
    },
  };
}
