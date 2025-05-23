import AnimatedSpritePreview from "../../AnimatedSpritePreview";
import { SPRITES_MAP } from "@/app/game/gameAssets";
import { useState } from "react";
import ChevronLeft from "@/components/icons/ChevronLeft";
import ChevronRight from "@/components/icons/ChevronRight";
import LeaderboardNumberedInput from "./LeaderboardNumberedInput";
import useRequest from "@/hooks/useRequest";

type LeaderboardEntry = {
  rank: number;
  username: string;
  xp: number;
  isCurrentUser: boolean;
  avatar: string;
};

const DEFAULT_PAGE_SIZE = 2;

export default function LeaderboardContent() {
  const [page, setPage] = useState(1);

  const { data: leaderboardData, error } = useRequest(
    `/leaderboard?page=${page}&size=${DEFAULT_PAGE_SIZE}`
  );

  if (error) {
    return (
      <p className="text-center">
        There&apos;s something wrong. Please try again later.
      </p>
    );
  }

  const setPreviousPage = () => {
    changePage(Math.max(page - 1, 1));
  };

  const setNextPage = () => {
    changePage(Math.min(page + 1, leaderboardData.meta.totalPages - 1));
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= leaderboardData.meta.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      {/* Leaderboard */}
      <div className="space-y-1">
        {leaderboardData.data.leaderboard.map((entry: LeaderboardEntry) => (
          <LeaderboardItem key={entry.rank} item={entry} />
        ))}
        <hr className="opacity-50" />
        <LeaderboardItem
          item={leaderboardData.data.currentUser}
          inLeaderboard={false}
        />
      </div>
      <div className="flex justify-between items-center">
        {/* Navigation Utilities */}
        <button onClick={setPreviousPage}>
          <ChevronLeft width={24} height={24} />
        </button>
        <div className="flex items-center gap-2">
          <LeaderboardNumberedInput
            page={page}
            onPageChange={changePage}
            totalPages={leaderboardData.meta.totalPages}
          />
          <b>/ {leaderboardData.meta.totalPages}</b>
        </div>
        <button onClick={setNextPage}>
          <ChevronRight width={24} height={24} />
        </button>
      </div>
    </>
  );
}

function LeaderboardItem({
  item,
  inLeaderboard = true,
}: {
  item: LeaderboardEntry;
  inLeaderboard?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 justify-between items-center p-2 rounded-md ${
        item.isCurrentUser && inLeaderboard && "bg-black/5"
      }`}
    >
      <div className="flex items-center gap-4 max-w-sm">
        <p className="w-10 shrink-0">{item.rank}</p>
        <div className="border-2 rounded-md shrink-0 [&>*]:scale-125 overflow-hidden">
          <AnimatedSpritePreview
            sprite={SPRITES_MAP.get(item.avatar)!}
            width={48}
            height={48}
            isStatic={true}
          />
        </div>
        <p className="truncate">{inLeaderboard ? item.username : "You"}</p>
      </div>
      <p>{item.xp} XP</p>
    </div>
  );
}
