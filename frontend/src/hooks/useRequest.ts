import useSWR from "swr";

export default function useRequest(url: string, suspense: boolean = true) {
  const { data, error, isLoading, isValidating } = useSWR(url, (url) =>
    fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((r) => r.json()),
    { suspense }
  );

  return { data, error, isLoading, isValidating };
}