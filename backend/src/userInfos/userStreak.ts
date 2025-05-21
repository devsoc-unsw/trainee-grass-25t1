import { PrismaClient } from "@prisma/client";

export async function getStreakCounter(userId: string) {
  
  const prisma = new PrismaClient();

  const user: any =  await prisma.user.findUnique({
    where: {id: userId},
  });

  if (!user) {
    return {error: "failed to Find User"};
  }

  const streak = user.streaks;
  return streak;
}