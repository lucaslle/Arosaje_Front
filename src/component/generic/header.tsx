import { Box, Flex, Heading } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import AvatarMenu from "./avatar.tsx";
import { ColorModeToggle, LanguageMenu } from "./preferences.tsx";
import { TranslationKey, useT } from "../../i18n/index.ts";

const PAGE_TITLES: Record<string, TranslationKey> = {
    "/dashboard": "nav.dashboard",
    "/myplants": "nav.myPlants",
    "/all_plants": "nav.plants",
    "/care-requests": "nav.plantSitting",
    "/setting": "nav.settings",
    "/like": "nav.favourites",
    "/advice": "nav.advice",
    "/admin": "nav.admin",
};

function Header() {
    const { pathname } = useLocation();
    const t = useT();

    return (
        <Box
            as="header"
            position="sticky"
            top={0}
            zIndex="docked"
            bg="bg.header"
            backdropFilter="saturate(180%) blur(8px)"
            borderBottomWidth="1px"
            borderColor="border.subtle"
            px={{ base: 4, md: 8 }}
            h={16}
        >
            <Flex h="100%" align="center" gap={4}>
                <Heading as="h1" size="md" noOfLines={1}>
                    {PAGE_TITLES[pathname] ? t(PAGE_TITLES[pathname]) : ""}
                </Heading>
                <Flex ml="auto" gap={{ base: 1, sm: 2 }} align="center">
                    <LanguageMenu />
                    <ColorModeToggle />
                    <AvatarMenu />
                </Flex>
            </Flex>
        </Box>
    );
}

export default Header;
