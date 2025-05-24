import BullseyeArrow from "@/components/icons/BullseyeArrow";
import GameButton from "@/app/game/components/GameButton";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose
} from "@/components/ui/Dialog";
import React, {useEffect, useState} from "react";
import { request } from "@/lib/utils";

export default function SimpleBox() {

  const [streak, setStreak] = useState(0)

  const fetchStreak = async () => {
    const { data, error } = await request("GET", "/streak");
    if (!error) {
    setStreak(data);
  } else {
    console.error("Failed to fetch streak:", error);
  }
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
          <GameButton tooltipText="Streak">
            <div className="flex items-center w-60 justify-between" >
                <div className="flex items-center">
                  <BullseyeArrow className="w-10 h-10 top-2 left-5 text-black" />
                  <span>Streaks </span>
                </div>
                <span>{streak} days </span>
            </div>
          </GameButton>
      </DialogTrigger>
      <DialogContent 
        className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <DialogTitle className="font-bold text-center text-xl">
          View Streaks
        </DialogTitle>
        <div className="flex justify-center gap-4">
          <div className="grid grid-cols-2 h-96 overflow-y-auto">
            <span className="absolute text-2xl left-20 top-25">Streak Count:</span>
            <span className="absolute text-2xl left-130 top-25">{streak}</span>
            <span className="absolute text-2xl left-20 top-55">days Skipped:</span>
            <span className="absolute text-2xl left-115 top-55">Coming Soon</span>
            <span className="absolute text-2xl left-20 top-85">currentDayCompleted:</span>
            <span className="absolute text-2xl left-115 top-85">Coming Soon</span>
          </div>
        </div>
        <DialogClose
          className="bg-foreground text-background w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed"
          onClick={() => fetchStreak()}
          >
            Update Streaks
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

