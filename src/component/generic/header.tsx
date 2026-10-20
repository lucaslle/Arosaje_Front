import { Box, Flex, Heading, IconButton, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import GenericButton from "./genericButton.tsx";
import AvatarMenu from "./avatar.tsx";
import AddModal from "../specific/addModal.tsx";
import { ColorModeToggle, LanguageMenu } from "./preferences.tsx";
import { TranslationKey, useT } from "../../i18n/index.ts";

const PAGE_TITLES: Record<string, TranslationKey> = {
    "/myplants": "nav.myPlants",
    "/all_plants": "nav.plants",
    "/care-requests": "nav.plantSitting",
    "/setting": "nav.settings",
    "/like": "nav.favourites",
};

function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
                    <GenericButton
                        display={{ base: "none", sm: "inline-flex" }}
                        label={t("header.addPlant")}
                        leftIcon={<AddIcon boxSize={3} />}
                        onClick={onOpen}
                    />
                    <IconButton
                        display={{ base: "inline-flex", sm: "none" }}
                        aria-label={t("header.addPlant")}
                        icon={<AddIcon boxSize={3} />}
                        onClick={onOpen}
                    />
                    <LanguageMenu />
                    <ColorModeToggle />
                    <AvatarMenu />
                </Flex>
            </Flex>
            <AddModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}

export default Header;
