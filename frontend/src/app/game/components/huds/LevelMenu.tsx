"use client";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/Dialog";
import GameButton from "@/app/game/components/GameButton";
import { Progress } from "@/components/ui/progress";

function LevelMenu() {
  const mockUser = {
    id: "randomID",
    name: "User Name",
    email: "user.name@email.com",
    username: "username",
    password: "Password1*",
    levels: 1,
    streaks: 1,
    xp: 18,
    leetcodeHandle: "userhandle",
    totalSolved: 20,
    easySolved: 10,
    mediumSolved: 9,
    hardSolved: 1,
    solvedProblems: 20,
  };

  const levelsMap = {
    1: 10,
    2: 25,
    3: 40,
    4: 60,
    5: 90,
    6: 125,
    7: 165,
    8: 210,
    9: 260,
    10: 315,
    11: 375,
    12: 440,
    13: 510,
    14: 585,
    15: 665,
    16: 750,
    17: 840,
    18: 935,
    19: 1035,
    20: 1140,
  };

  const getXPLeft = (user: any, levelsMap: any) => {
    const currLevel = user.levels;
    const currXP = user.xp;
    const nextLevelXP = levelsMap[currLevel + 1];

    if (!nextLevelXP) {
      return 0;
    }

    const XPLeft = nextLevelXP - currXP;
    return XPLeft > 0 ? XPLeft : 0;
  };

  const syncProgress = async (userId: string, leetcodeHandle: string) => {
    try {
      const response = await fetch("/sync-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, leetcodeHandle }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Progress synced! New XP: ${data.newXP}, Level: ${data.newLevel}`
        );
      } else {
        alert(data.message || "Failed to sync progress");
      }
    } catch (error) {
      console.error("Error syncing progress: ", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <GameButton tooltipText="Progress">
          <div className="flex flex-col w-60 gap-y-0.5">
            {/* User's curr level and next level */}
            <div className="flex flex-row justify-between font-semibold text-sm">
              <p>Level {mockUser.levels}</p>
              <p>{mockUser.levels + 1}</p>
            </div>
            {/* User's xp and xp required to reach next level */}
            <Progress value={mockUser.xp} />
            <p className="flex ml-auto text-xs font-semibold">
              {getXPLeft(mockUser, levelsMap)} XP Left
            </p>
          </div>
        </GameButton>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="font-bold text-center text-xl">
          Your Progress
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between w-full">
            <p>Current Level</p>
            <p>Level 1</p>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p>Total XP</p>
            <p>18 XP</p>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p>Next Level</p>
            <p>{mockUser.levels + 1} XP</p>
          </div>

          <button
            onClick={() => syncProgress(mockUser.id, mockUser.leetcodeHandle)}
            className="bg-black text-white w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed"
          >
            Sync My Progress
          </button>
        </div>
        {/* <DialogClose className="bg-foreground text-background w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed">
          Close
        </DialogClose> */}
      </DialogContent>
    </Dialog>
  );
}

export default LevelMenu;
