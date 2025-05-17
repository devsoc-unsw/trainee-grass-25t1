import { PrismaClient } from "@prisma/client";

export async function getStreakCounter(userId: string) {
  
  const prisma = new PrismaClient();

  const user: any =  await prisma.user.findUnique({
    where: {id: userId},
  });

  const streak = user.streaks;

  return streak;
}