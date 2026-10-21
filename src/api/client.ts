import { API_URL } from "./apiUrl.ts";
import { apiErrorMessage } from "./apiError.ts";

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export const SESSION_EXPIRED = "arosaje:session-expired";

export const authHeaders = (): Record<string, string> => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// fetch with the token, JSON bodies and readable errors; returns undefined for 204
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const isJson = typeof init.body === "string";
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: { ...authHeaders(), ...(isJson ? { "Content-Type": "application/json" } : {}), ...init.headers },
    });
    if (!response.ok) {
        if (response.status === 401 && localStorage.getItem("token")) {
            window.dispatchEvent(new Event(SESSION_EXPIRED));
        }
        const data = await response.json().catch(() => null);
        throw new ApiError(response.status, apiErrorMessage(data, `HTTP ${response.status}`));
    }
    return response.status === 204 ? (undefined as T) : response.json();
}

export const jsonBody = (value: unknown) => JSON.stringify(value);
