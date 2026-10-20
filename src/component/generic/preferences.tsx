import { Box, Button, IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Text, useColorMode } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { LANGUAGES, Language, useLanguageStore, useT } from "../../i18n/index.ts";
import Flag from "./flag.tsx";

export const ColorModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const t = useT();
    const label = colorMode === "dark" ? t("prefs.toLight") : t("prefs.toDark");

    return (
        <IconButton
            aria-label={label}
            title={label}
            variant="ghost"
            color="text.secondary"
            icon={<Box as="i" className={`fa-solid ${colorMode === "dark" ? "fa-sun" : "fa-moon"}`} aria-hidden="true" />}
            onClick={toggleColorMode}
        />
    );
};

export const LanguageMenu = ({ showName = false }: { showName?: boolean }) => {
    const language = useLanguageStore((state) => state.language);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    const t = useT();

    return (
        // isLazy: a closed Menu otherwise keeps its hidden list unpositioned past the right edge, adding page scrollbars
        <Menu placement="bottom-end" isLazy>
            <MenuButton
                as={Button}
                variant="ghost"
                color="text.secondary"
                px={2}
                rightIcon={<ChevronDownIcon />}
                aria-label={`${t("prefs.language")} (${LANGUAGES[language].name})`}
                title={t("prefs.language")}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Flag language={language} />
                    <Text as="span" display={showName ? "inline" : { base: "none", md: "inline" }} fontSize="sm" textTransform="uppercase">
                        {showName ? LANGUAGES[language].name : language}
                    </Text>
                </Box>
            </MenuButton>
            <MenuList minW="44" zIndex="popover">
                <MenuOptionGroup type="radio" value={language} onChange={(value) => setLanguage(value as Language)} title={t("prefs.language")}>
                    {(Object.keys(LANGUAGES) as Language[]).map((code) => (
                        <MenuItemOption key={code} value={code} lang={code}>
                            <Box display="flex" alignItems="center" gap={3}>
                                <Flag language={code} />
                                {LANGUAGES[code].name}
                            </Box>
                        </MenuItemOption>
                    ))}
                </MenuOptionGroup>
            </MenuList>
        </Menu>
    );
};
