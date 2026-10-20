import { useCallback } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fr } from "./fr.ts";
import { en } from "./en.ts";
import { es } from "./es.ts";
import { de } from "./de.ts";
import { it } from "./it.ts";
import { pt } from "./pt.ts";

// names are written in their own language so anyone can find theirs
export const LANGUAGES = {
    fr: { name: "Français", locale: "fr-FR" },
    en: { name: "English", locale: "en-GB" },
    es: { name: "Español", locale: "es-ES" },
    de: { name: "Deutsch", locale: "de-DE" },
    it: { name: "Italiano", locale: "it-IT" },
    pt: { name: "Português", locale: "pt-PT" },
} as const;
export type Language = keyof typeof LANGUAGES;
export type TranslationKey = keyof typeof fr;

const dictionaries: Record<Language, Record<TranslationKey, string>> = { fr, en, es, de, it, pt };

const isLanguage = (value: string): value is Language => value in LANGUAGES;
const browserLanguage = (navigator.language ?? "fr").slice(0, 2);

export const translate = (language: Language, key: TranslationKey, vars?: Record<string, string | number>) =>
    dictionaries[language][key].replace(/\{(\w+)\}/g, (match, name) => String(vars?.[name] ?? match));

interface LanguageState {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: isLanguage(browserLanguage) ? browserLanguage : "fr",
            setLanguage: (language) => set({ language }),
        }),
        { name: "language" }
    )
);

const syncHtmlLang = (language: Language) => {
    document.documentElement.lang = language;
};
syncHtmlLang(useLanguageStore.getState().language);
useLanguageStore.subscribe((state) => syncHtmlLang(state.language));

export const useT = () => {
    const language = useLanguageStore((state) => state.language);
    return useCallback(
        (key: TranslationKey, vars?: Record<string, string | number>) => translate(language, key, vars),
        [language]
    );
};

export const useLocale = () => LANGUAGES[useLanguageStore((state) => state.language)].locale;

export const isTranslationKey = (value: string): value is TranslationKey => value in fr;

// care dates are calendar days ("2026-08-12"): build them locally so no time zone shifts the day
export const useFormatDay = () => {
    const locale = useLocale();
    return useCallback((day: string) => {
        const [year, month, date] = day.split("-").map(Number);
        return new Date(year, month - 1, date).toLocaleDateString(locale, { day: "numeric", month: "short" });
    }, [locale]);
};
