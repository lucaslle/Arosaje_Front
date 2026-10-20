import { describe, expect, it } from "vitest";
import { careState } from "../generic/CardFeed";

describe("careState", () => {
    it("owner asked for a sitter: I can take it", () => {
        expect(careState(null, 1, true)).toEqual({ isCare: false, isCaredByOther: false, canTake: true });
    });

    it("owner did not ask for a sitter: nobody can take it", () => {
        expect(careState(null, 1, false)).toEqual({ isCare: false, isCaredByOther: false, canTake: false });
    });

    it("I care for the plant", () => {
        expect(careState(1, 1, false)).toEqual({ isCare: true, isCaredByOther: false, canTake: false });
    });

    it("someone else cares for the plant", () => {
        expect(careState(2, 1, true)).toEqual({ isCare: false, isCaredByOther: true, canTake: false });
    });

    it("current user not loaded yet", () => {
        expect(careState(null, null, true)).toEqual({ isCare: false, isCaredByOther: false, canTake: false });
    });
});
