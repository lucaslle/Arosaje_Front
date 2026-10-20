import { describe, expect, it } from "vitest";
import { careAction } from "../generic/CardFeed";

const plant = (overrides = {}) => ({ owner_id: 9, in_care_id: null, care_requested: true, ...overrides });

describe("careAction", () => {
    it("lets a member offer when the owner asked for a sitter", () => {
        expect(careAction(plant(), 1)).toBe("can_offer");
    });

    it("shows a pending offer instead of a second offer button", () => {
        expect(careAction(plant(), 1, { status: "pending" })).toBe("offer_pending");
    });

    it("knows when I am the sitter", () => {
        expect(careAction(plant({ in_care_id: 1, care_requested: false }), 1, { status: "accepted" })).toBe("sitting");
    });

    it("offers nothing on my own plant, without a request, or when someone else looks after it", () => {
        expect(careAction(plant({ owner_id: 1 }), 1)).toBe("none");
        expect(careAction(plant({ care_requested: false }), 1)).toBe("none");
        expect(careAction(plant({ in_care_id: 2, care_requested: false }), 1)).toBe("none");
    });

    it("offers nothing before the member is loaded", () => {
        expect(careAction(plant(), null)).toBe("none");
    });
});

import { pinBotanistAdvice } from "../specific/Comment/DrawerComment";

describe("pinBotanistAdvice", () => {
    it("puts verified botanists first and keeps each group's order", () => {
        const comments = [
            { id: 1, user: { is_botanist: false } },
            { id: 2, user: { is_botanist: true } },
            { id: 3, user: { is_botanist: false } },
            { id: 4, user: { is_botanist: true } },
        ];
        expect(pinBotanistAdvice(comments).map((c) => c.id)).toEqual([2, 4, 1, 3]);
    });
});
