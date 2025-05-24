import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getStreakCounter(userId: string) {

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return {error: "failed to Find User"};
  }

  const streak = user.streaks;

  return streak;
}