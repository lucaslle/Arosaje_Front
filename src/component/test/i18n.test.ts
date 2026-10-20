import { describe, expect, it } from "vitest";
import { LANGUAGES, Language, isTranslationKey, translate } from "../../i18n/index.ts";
import { fr } from "../../i18n/fr.ts";
import { en } from "../../i18n/en.ts";
import { es } from "../../i18n/es.ts";
import { de } from "../../i18n/de.ts";
import { it as italian } from "../../i18n/it.ts";
import { pt } from "../../i18n/pt.ts";

const DICTIONARIES: Record<Language, Record<string, string>> = { fr, en, es, de, it: italian, pt };

describe("i18n", () => {
    it("offers a dictionary for every listed language", () => {
        expect(Object.keys(DICTIONARIES).sort()).toEqual(Object.keys(LANGUAGES).sort());
    });

    it.each(Object.keys(DICTIONARIES))("%s has every key and no empty text", (language) => {
        const dictionary = DICTIONARIES[language as Language];
        expect(Object.keys(dictionary).sort()).toEqual(Object.keys(fr).sort());
        expect(Object.entries(dictionary).filter(([, text]) => !text.trim())).toEqual([]);
    });

    it.each(Object.keys(DICTIONARIES))("%s keeps the {variables} of the French text", (language) => {
        const variables = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
        const dictionary = DICTIONARIES[language as Language];
        const broken = Object.keys(fr).filter((key) => variables(dictionary[key]).join() !== variables(fr[key as keyof typeof fr]).join());
        expect(broken).toEqual([]);
    });

    it("fills variables and keeps unknown ones visible", () => {
        expect(translate("fr", "comments.remaining", { count: 12 })).toBe("12 caractères restants");
        expect(translate("en", "plant.editTitle", { name: "Monstera" })).toBe("Edit Monstera");
        expect(translate("en", "plant.editTitle")).toBe("Edit {name}");
        expect(translate("de", "plant.editTitle", { name: "Monstera" })).toBe("Monstera bearbeiten");
    });

    it("recognises keys thrown by the API helpers", () => {
        expect(isTranslationKey("login.badCredentials")).toBe(true);
        expect(isTranslationKey("Email already registered")).toBe(false);
    });
});
