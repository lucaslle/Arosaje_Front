import { Box } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Language } from "../../i18n/index.ts";

// inline SVG: flag emoji do not render on Windows
const FLAGS: Record<Language, ReactElement> = {
    fr: (
        <>
            <rect width="10" height="20" fill="#002654" />
            <rect x="10" width="10" height="20" fill="#fff" />
            <rect x="20" width="10" height="20" fill="#CE1126" />
        </>
    ),
    en: (
        <>
            <rect width="30" height="20" fill="#012169" />
            <path d="M0 0L30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
            <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.6" />
            <path d="M15 0V20M0 10H30" stroke="#fff" strokeWidth="6" />
            <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="3.4" />
        </>
    ),
    es: (
        <>
            <rect width="30" height="20" fill="#AA151B" />
            <rect y="5" width="30" height="10" fill="#F1BF00" />
        </>
    ),
    de: (
        <>
            <rect width="30" height="7" fill="#000" />
            <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
            <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
        </>
    ),
    it: (
        <>
            <rect width="10" height="20" fill="#009246" />
            <rect x="10" width="10" height="20" fill="#fff" />
            <rect x="20" width="10" height="20" fill="#CE2B37" />
        </>
    ),
    pt: (
        <>
            <rect width="12" height="20" fill="#046A38" />
            <rect x="12" width="18" height="20" fill="#DA291C" />
            <circle cx="12" cy="10" r="4" fill="#FFE900" />
        </>
    ),
};

const Flag = ({ language, size = 5 }: { language: Language; size?: number }) => (
    <Box
        as="svg"
        viewBox="0 0 30 20"
        w={size}
        h={size * (2 / 3)}
        borderRadius="sm"
        boxShadow="0 0 0 1px rgba(0, 0, 0, 0.15)"
        flexShrink={0}
        aria-hidden="true"
    >
        {FLAGS[language]}
    </Box>
);

export default Flag;
