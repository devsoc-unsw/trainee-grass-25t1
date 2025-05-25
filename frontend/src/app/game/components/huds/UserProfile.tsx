"use client";

import GameButton from "@/app/game/components/GameButton";
import User from "@/components/icons/User";
import Logout from "@/components/icons/Logout";
import { request } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingCircle from "@/components/icons/LoadingCircle";

function UserProfile({ userName }: { userName: string | undefined }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);

    const { error } = await request("POST", "/auth/logout");

    setLoading(false);

    if (error) {
      console.error("Error occurred while logging out: " + error);
      return;
    }

    router.push("/");
  };

  return (
    <GameButton>
      <div className="flex flex-row items-center gap-x-4">
        <User width={32} height={32} />
        <p className="text-lg">{userName}</p>
        {!loading ? (
          <Logout width={32} height={32} onClick={logout} />
        ) : (
          <LoadingCircle />
        )}
      </div>
    </GameButton>
  );
}

export default UserProfile;
