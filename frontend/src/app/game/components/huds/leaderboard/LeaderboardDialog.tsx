"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import Trophy from "@/components/icons/Trophy";
import GameButton from "../../GameButton";
import { Suspense, useState } from "react";
import ChevronRight from "@/components/icons/ChevronRight";
import ChevronLeft from "@/components/icons/ChevronLeft";
import Leaderboard from "./Leaderboard";

// TODO: Delete this variable when we can retrieve data from backend
const MAX_PAGE_COUNT = 10;

export default function LeaderboardDialog() {
  const [page, setPage] = useState(0);
  const [input, setInput] = useState("1");

  const setPreviousPage = () => {
    changePage(Math.max(page - 1, 0));
  };

  // TODO: Change MAX_PAGE_COUNT when we can retrieve data from backend
  const setNextPage = () => {
    changePage(Math.min(page + 1, MAX_PAGE_COUNT - 1));
  };

  const handlePageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d+$/.test(value)) {
      setInput(value);
      return; // Ignore non-numeric input
    }

    changePage(parseInt(value, 10) - 1);
  };

  // TODO: Change MAX_PAGE_COUNT when we can retrieve data from backend
  const changePage = (newPage: number) => {
    if (newPage >= 0 && newPage < MAX_PAGE_COUNT) {
      setPage(newPage);
      setInput((newPage + 1).toString());
    }
  };

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
          <Leaderboard pageNumber={page} />
        </Suspense>
        {/* Navigation Utilities */}
        <div className="flex justify-between">
          <button onClick={setPreviousPage}>
            <ChevronLeft width={24} height={24} />
          </button>
          {/* TODO: Change MAX_PAGE_COUNT when we can retrieve data from backend */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={input}
              onChange={handlePageOnChange}
              min={1}
              max={MAX_PAGE_COUNT}
              className="border-2 pl-1 rounded-md"
            />
            <b>/ {MAX_PAGE_COUNT}</b>
          </div>
          <button onClick={setNextPage}>
            <ChevronRight width={24} height={24} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
