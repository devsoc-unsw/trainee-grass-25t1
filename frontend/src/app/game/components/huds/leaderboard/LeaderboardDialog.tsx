import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import Trophy from "@/components/icons/Trophy";
import GameButton from "../../GameButton";
import { Suspense } from "react";
import LeaderboardContent from "./LeaderboardContent";

export default function LeaderboardDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <GameButton tooltipText="Leaderboard">
          <Trophy width={32} height={32} />
        </GameButton>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold text-center text-xl">
          Leaderboard
        </DialogTitle>
        {/* Leaderboard Content */}
        {/* TODO: Change fallback to a proper skeleton */}
        <Suspense fallback={<div>Loading...</div>}>
          <LeaderboardContent />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
