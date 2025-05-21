import BullseyeArrow from "@/components/icons/BullseyeArrow";
import GameButton from "@/app/game/components/GameButton";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose
} from "@radix-ui/react-dialog";
import React, {useEffect, useState} from "react";


export default function SimpleBox() {

  const [streak, setStreak] = useState({
    streakCount: 0,  
    daysSkipped: 0,
    currentDayCompleted: 0,
  })

  const fetchStreak = () => {
    fetch("/streak")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStreak(data);
      })
      .catch(() => console.log("error"));
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
          <GameButton>
            <div className="flex items-center w-60 justify-between" >
                <div className="flex items-center">
                  <BullseyeArrow className="w-10 h-10 top-2 left-5 text-black" />
                  <span>Streaks </span>
                </div>
                <span>{streak.streakCount} days </span>
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
            <span className=" text-2xl left-5 top-25">Streak Count:</span>
            <span className=" text-2xl left-90 top-25">{streak.streakCount}</span>
            <span className=" text-2xl left-5 top-55">days Skipped:</span>
            <span className=" text-2xl left-90 top-55">{streak.daysSkipped}</span>
            <span className=" text-2xl left-5 top-85">currentDayCompleted:</span>
            <span className=" text-2xl left-90 top-85">{streak.currentDayCompleted}</span>
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

