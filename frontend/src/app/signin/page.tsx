"use client";

import { request } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { error } = await request("POST", "/auth/register", {
      leetcodeSessionCookie: input,
    });

    if (error) {
      alert(error);
      return;
    }

    router.push("/game");
  };

  return (
    <form className="flex flex-col gap-2 p-2">
      <label htmlFor="cookies-input">Leetcode Session Cookies</label>
      <input
        id="cookies-input"
        type="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border"
        placeholder="Enter your cookies here..."
      />
      <button
        type="submit"
        onClick={handleOnSubmit}
        className="bg-foreground text-background"
      >
        Submit
      </button>
    </form>
  );
}
