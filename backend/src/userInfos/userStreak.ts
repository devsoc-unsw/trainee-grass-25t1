export async function getStreakCounter() {
    
    const response = await fetch("https://leetcode.com/graphql", {
      method: 'POST',
      body: JSON.stringify({
        query: `
        query getStreakCounter {
          streakCounter {
            streakCount
            daysSkipped
            currentDayCompleted
          }
        }
      `
      })
    })

    const data: any = await response.json();
    const streak = data.streakCounter;

    return streak.streakCount;
}