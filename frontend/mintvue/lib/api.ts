const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=").slice(1).join("=") ?? null
  );
}

export function clearToken() {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const token = getToken();

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

  if (response.status === 401) {
    clearToken();
    window.location.href = "/auth";
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const error = await response.json();
    const detail = error?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
        ? detail.map((d: { msg: string }) => d.msg).join(", ")
        : "Something went wrong";
    throw new Error(message);
  }

  return response.json();
}