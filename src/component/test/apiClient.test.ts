import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, SESSION_EXPIRED, api } from "../../api/client";

const respond = (status: number, body: unknown = {}) =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("api client", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it("announces an expired session once a signed-in call gets a 401", async () => {
        localStorage.setItem("token", "old");
        respond(401, { detail: "Could not validate credentials" });
        const expired = vi.fn();
        window.addEventListener(SESSION_EXPIRED, expired);

        await expect(api("/my_plants/")).rejects.toBeInstanceOf(ApiError);
        expect(expired).toHaveBeenCalledTimes(1);
        window.removeEventListener(SESSION_EXPIRED, expired);
    });

    it("does not treat a failed sign-in as an expired session", async () => {
        respond(401, { detail: "Incorrect email or password" });
        const expired = vi.fn();
        window.addEventListener(SESSION_EXPIRED, expired);

        await expect(api("/token", { method: "POST" })).rejects.toMatchObject({ status: 401, message: "Incorrect email or password" });
        expect(expired).not.toHaveBeenCalled();
        window.removeEventListener(SESSION_EXPIRED, expired);
    });
});
