"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/Dialog";
import GameButton from "@/app/game/components/GameButton";
import { Progress } from "@/components/ui/progress";
import { LEVEL_THRESHOLD_ARRAY } from "@/constants/levels";
import { useEffect, useState } from "react";
import LoadingCircle from "../LoadingCircle";

function LevelMenu({ user }: { user: any }) {
  const [userData, setUserData] = useState(user);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    if (user && user.levels !== undefined && user.xp !== undefined) {
      setUserData(user);
      setIsDataLoaded(true);
    }
  }, [user]);

  const getXPLeft = (user: any) => {
    const currLevel = user?.levels;
    const currXP = user?.xp;
    const nextLevelXP = LEVEL_THRESHOLD_ARRAY[currLevel];

    if (!nextLevelXP) {
      return 0;
    }

    const XPLeft = nextLevelXP - currXP;
    return XPLeft > 0 ? XPLeft : 0;
  };

  const getProgressPercentage = (user: any) => {
    const level = user?.levels - 1;
    const currXP = user?.xp ?? 0;
    const currLevelXP = LEVEL_THRESHOLD_ARRAY[level];
    const nextLevelXP = LEVEL_THRESHOLD_ARRAY[level + 1];

    if (!nextLevelXP || nextLevelXP === currLevelXP) {
      return 100;
    }

    const gainedXP = currXP - currLevelXP;
    const totalRequiredXP = nextLevelXP - currLevelXP;
    const progress = (gainedXP / totalRequiredXP) * 100;

    return Math.min(Math.max(progress, 0), 100);
  };

  const syncProgress = async (userId: string, leetcodeHandle: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/sync-progress",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, leetcodeHandle }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setResultMessage(data.message || "Failed to sync progress.");
      } else if (data.message === "No new problems solved.") {
        setResultMessage(data.message);
      } else if (data.message === "User progress synced!") {
        setResultMessage(
          `Progress synced! New XP: ${data.newXP}, Level: ${data.newLevel}`
        );
        setUserData((prev: any) => ({
          ...prev,
          xp: data.newXP,
          levels: data.newLevel,
        }));
      }

      setResultDialogOpen(true);
    } catch (error) {
      console.error("Error syncing progress: ", error);
      setResultMessage("An error occurred while syncing progress.");
      setResultDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDataLoaded) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <GameButton tooltipText="Progress">
            <div className="flex flex-col w-60 gap-y-0.5">
              <div className="flex flex-row justify-between font-semibold text-sm">
                <span className="flex flex-row items-center gap-x-2">
                  Level <LoadingCircle />
                </span>
                <span className="flex items-center">0</span>
              </div>
              <Progress value={0} />
              <span className="flex items-center gap-x-2 ml-auto text-xs font-semibold">
                0 XP Left
              </span>
            </div>
          </GameButton>
        </DialogTrigger>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <GameButton tooltipText="Progress">
            <div className="flex flex-col w-60 gap-y-0.5">
              {/* User's curr level and next level */}
              <div className="flex flex-row justify-between font-semibold text-sm">
                <p>Level {userData?.levels}</p>
                <p>{(userData?.levels ?? 0) + 1}</p>
              </div>
              {/* User's xp and xp required to reach next level */}
              <Progress value={getProgressPercentage(userData)} />
              <p className="flex ml-auto text-xs font-semibold">
                {getXPLeft(userData)} XP Left
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
              <p>Level {userData?.levels}</p>
            </div>
            <div className="flex flex-row justify-between w-full">
              <p>Your XP</p>
              <p>{userData?.xp} XP</p>
            </div>
            <div className="flex flex-row justify-between w-full">
              <p>Next Level</p>
              <p>{LEVEL_THRESHOLD_ARRAY[userData?.levels]} XP</p>
            </div>

            <button
              onClick={() => syncProgress(user.id, user.leetcodeHandle)}
              className="bg-black text-white w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex justify-center items-center gap-2">
                  <LoadingCircle />
                  Syncing...
                </span>
              ) : (
                "Sync My Progress"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result dialog */}
      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent>
          <DialogTitle className="text-lg font-bold">Sync Result</DialogTitle>
          <p>{resultMessage}</p>

          <button
            className="mt-4 bg-black text-white p-2 rounded-md w-full cursor-pointer"
            onClick={() => setResultDialogOpen(false)}
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LevelMenu;
