const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;


export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const token =
  typeof window !== "undefined"
    ? document.cookie
        .split("; ")
        .find((row) =>
          row.startsWith("token=")
        )
        ?.split("=")[1]
    : null;

  const response = await fetch(`${API_URL}${API_PREFIX}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {

    const error = await response.json();

    throw new Error(
      error?.detail || "Something went wrong"
    );
  }

  return response.json();
}