import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import useSWR from "swr";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export default function useRequest(url: string) {
  const { data, error, isLoading, isValidating } = useSWR(url, (url) =>
    fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json()),
    { suspense: true }
  );

  return { data, error, isLoading, isValidating };
}

export async function request(
  method: RequestMethod,
  url: string,
  body?: Record<string, unknown>
) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
      method,
      credentials: "include",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        data?.error || `Request failed with status ${response.status}`
      );
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}
