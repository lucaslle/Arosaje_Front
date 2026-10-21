import { ApiError, api, jsonBody } from "./client.ts";

// errors are translation keys when the page has a better message than the API's
const rethrow = (error: unknown, keys: Record<number, string>, fallback: string): never => {
    if (error instanceof ApiError && keys[error.status]) throw new Error(keys[error.status]);
    if (error instanceof ApiError && !error.message.startsWith("HTTP ")) throw error;
    throw new Error(fallback);
};

export const loginUser = (credentials: { email: string; password: string }) =>
    api<{ access_token: string }>("/token", {
        method: "POST",
        body: new URLSearchParams({ username: credentials.email, password: credentials.password }),
    }).catch((error) => rethrow(error, { 401: "login.badCredentials", 429: "login.tooManyAttempts" }, "login.genericError"));

export const registerUser = (user: { username: string; email: string; phone: string; password: string; is_botanist: boolean }) =>
    api("/users/", {
        method: "POST",
        body: jsonBody({ username: user.username, email: user.email, phone: user.phone, password: user.password, is_botanist: user.is_botanist }),
    }).catch((error) => rethrow(error, {}, "register.genericError"));
