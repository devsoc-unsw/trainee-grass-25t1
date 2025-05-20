import { MOCK_LEADERBOARD_DATA } from "./constants";
import AnimatedSpritePreview from "../../AnimatedSpritePreview";
import { SPRITES_MAP } from "@/app/game/gameAssets";
import useRequest from "@/lib/utils";

export default function Leaderboard({ pageNumber }: { pageNumber: number }) {
  // TODO: Change this to fetch data from backend
  // const { data: leaderboardData, error } = useRequest(`/leaderboard?page=${pageNumber}`);
  const leaderboardData = MOCK_LEADERBOARD_DATA;

  return (
    <div className="space-y-1">
      {leaderboardData.data.leaderboard.map((entry) => (
        <LeaderboardItem
          key={entry.rank}
          item={entry}
          isCurrentUser={entry.isCurrentUser}
        />
      ))}
      <hr className="opacity-50" />
      <LeaderboardItem
        item={leaderboardData.data.currentUser}
        inLeaderboard={false}
      />
    </div>
  );
}

function LeaderboardItem({
  item,
  inLeaderboard = true,
  isCurrentUser,
}: {
  item: {
    rank: number;
    avatar: string;
    username: string;
    xp: number;
  };
  inLeaderboard?: boolean;
  isCurrentUser?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 justify-between items-center p-2 rounded-md ${
        isCurrentUser && "bg-black/5"
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
