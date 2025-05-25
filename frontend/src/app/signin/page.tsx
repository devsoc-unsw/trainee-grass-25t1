"use client";

import LoadingCircle from "@/components/icons/LoadingCircle";
import { request } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SPRITES_MAP } from "../game/gameAssets";
import AnimatedSpritePreview from "../game/components/AnimatedSpritePreview";

export default function SignUpPage() {
  const router = useRouter();

  const [leetcodeSessionCookie, setLeetcodeSessionCookie] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const readyToSubmit = useMemo(
    () => leetcodeSessionCookie,
    [leetcodeSessionCookie]
  );

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await request("POST", "/auth/signin", {
      leetcodeSessionCookie,
    });

    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    router.push("/game");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(/mountain.png)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute top-46 left-1/2 -translate-x-1/2">
        <AnimatedSpritePreview
          sprite={SPRITES_MAP.get("default")!}
          width={160}
          height={140}
          isStatic
        />
      </div>

      {/* Centered signup form */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <form
          className="bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md"
          onSubmit={handleSignIn}
        >
          <p className="text-2xl font-bold mb-4 text-center">
            Sign In to LeetCode
          </p>
          <input
            type="text"
            name="leetcode-session-cookie"
            placeholder="Paste your LeetCode session cookie here..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-4"
            value={leetcodeSessionCookie}
            onChange={(e) => setLeetcodeSessionCookie(e.target.value)}
            required
            autoComplete="on"
          />
          <button
            type="submit"
            className="w-full py-2 bg-foreground text-white rounded-lg hover:bg-foreground/85 duration-150 transition disabled:bg-foreground/25 disabled:cursor-not-allowed"
            disabled={!readyToSubmit || loading}
          >
            {loading ? (
              <div className="flex gap-2 justify-center items-center">
                <LoadingCircle />
                <p>Signing in...</p>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
