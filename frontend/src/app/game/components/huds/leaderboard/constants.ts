export type Leaderboard = {
  meta: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalEntries: number;
  };
  data: {
    leaderboard: {
      rank: number;
      username: string;
      xp: number;
      isCurrentUser: boolean;
      avatar: string;
    }[];
    currentUser: {
      rank: number;
      username: string;
      xp: number;
      isCurrentUser: boolean;
      avatar: string;
      _links: {
        jumpToRankPage: { href: string };
      };
    };
  };
};

export const MOCK_LEADERBOARD_DATA: Leaderboard = {
  meta: {
    page: 1,
    pageSize: 5,
    totalPages: 10,
    totalEntries: 49,
  },
  data: {
    leaderboard: [
      {
        rank: 1,
        username: "Player1",
        xp: 100,
        isCurrentUser: false,
        avatar: "default",
      },
      {
        rank: 2,
        username: "Player2",
        xp: 90,
        isCurrentUser: false,
        avatar: "default",
      },
      {
        rank: 3,
        username: "Player3",
        xp: 80,
        isCurrentUser: false,
        avatar: "default",
      },
      {
        rank: 4,
        username: "Player4",
        xp: 70,
        isCurrentUser: true,
        avatar: "default",
      },
      {
        rank: 5,
        username: "Player5",
        xp: 60,
        isCurrentUser: false,
        avatar: "default",
      },
    ],
    currentUser: {
      rank: 4,
      username: "Player4",
      xp: 70,
      isCurrentUser: true,
      avatar: "default",
      _links: {
        jumpToRankPage: { href: "/leaderboard?page=1" },
      },
    },
  },
};
