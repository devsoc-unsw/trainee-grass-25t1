"use client";

import { useEffect, useState } from "react";

export default function LeaderboardNumberedInput({
  page: currentPage,
  onPageChange,
  totalPages,
}: {
  page: number;
  onPageChange: (n: number) => void;
  totalPages: number;
}) {
  const [input, setInput] = useState(currentPage.toString());

  useEffect(() => {
    setInput(currentPage.toString());
  }, [currentPage]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d+$/.test(value)) {
      setInput(value);
      return; // Ignore non-numeric input
    }

    onPageChange(parseInt(value, 10));
  };

  return (
    <input
      type="number"
      value={input}
      onChange={handleOnChange}
      min={1}
      max={totalPages}
      className="border-2 pl-1 rounded-md"
    />
  );
}
