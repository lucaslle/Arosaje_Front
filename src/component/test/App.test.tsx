import { afterEach, describe, expect, it } from "vitest";
import { isLoggedIn } from "../../App";

const jwt = (exp: number) => `x.${btoa(JSON.stringify({ exp }))}.y`;

describe("isLoggedIn", () => {
    afterEach(() => localStorage.clear());

    it("is false without a token", () => {
        expect(isLoggedIn()).toBe(false);
    });

    it("is false with an expired token", () => {
        localStorage.setItem("token", jwt(Date.now() / 1000 - 60));
        expect(isLoggedIn()).toBe(false);
    });

    it("is true with a valid token", () => {
        localStorage.setItem("token", jwt(Date.now() / 1000 + 60));
        expect(isLoggedIn()).toBe(true);
    });

    it("is false with a garbage token", () => {
        localStorage.setItem("token", "garbage");
        expect(isLoggedIn()).toBe(false);
    });
});
