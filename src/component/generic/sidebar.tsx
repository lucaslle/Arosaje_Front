import { Box, Flex, Text } from "@chakra-ui/react";
import { NavLink } from 'react-router-dom';
import Brand from './brand.tsx';
import { TranslationKey, useT } from '../../i18n/index.ts';

export const SIDEBAR_WIDTH = 64;

const menuItems: { id: string; label: TranslationKey; icon: string; href: string }[] = [
    { id: 'myplants', label: 'nav.myPlants', icon: 'fa-solid fa-house', href: '/myplants' },
    { id: 'allplants', label: 'nav.plants', icon: 'fa-solid fa-seedling', href: '/all_plants' },
    { id: 'plantscare', label: 'nav.plantSitting', icon: 'fa-solid fa-hand-holding-heart', href: '/care-requests' },
    { id: 'setting', label: 'nav.settings', icon: 'fa-solid fa-gear', href: '/setting' }
];

function Sidebar() {
    const t = useT();
    return (
        <Box
            as="nav"
            aria-label={t("nav.main")}
            position="fixed"
            zIndex="sticky"
            bg="bg.surface"
            borderColor="border.subtle"
            left={0}
            bottom={0}
            top={{ base: "auto", md: 0 }}
            w={{ base: "100%", md: SIDEBAR_WIDTH }}
            h={{ base: 16, md: "100vh" }}
            borderTopWidth={{ base: "1px", md: 0 }}
            borderRightWidth={{ base: 0, md: "1px" }}
            px={{ base: 2, md: 4 }}
            py={{ base: 0, md: 6 }}
        >
            <Box display={{ base: "none", md: "block" }} px={3} mb={10}>
                <Brand />
            </Box>

            <Flex as="ul" listStyleType="none" direction={{ base: "row", md: "column" }} gap={{ base: 0, md: 1 }} h={{ base: "100%", md: "auto" }}>
                {menuItems.map((item) => (
                    <Box as="li" key={item.id} flex={{ base: 1, md: "none" }}>
                        <NavLink to={item.href} end>
                            {({ isActive }) => (
                                <Flex
                                    direction={{ base: "column", md: "row" }}
                                    align="center"
                                    justify={{ base: "center", md: "flex-start" }}
                                    gap={{ base: 1, md: 3 }}
                                    h={{ base: 16, md: 12 }}
                                    px={{ base: 1, md: 4 }}
                                    borderRadius="xl"
                                    fontWeight={isActive ? "bold" : "semibold"}
                                    color={isActive ? "text.brand" : "text.muted"}
                                    bg={{ base: "transparent", md: isActive ? "bg.subtle" : "transparent" }}
                                    transition="background 150ms ease, color 150ms ease"
                                    _hover={{ color: "text.brand", bg: { md: "bg.subtle" } }}
                                >
                                    <Box as="i" display="inline-block" className={item.icon} aria-hidden="true" fontSize={{ base: "lg", md: "md" }} w={5} textAlign="center" />
                                    <Text fontSize={{ base: "xs", md: "md" }}>{t(item.label)}</Text>
                                </Flex>
                            )}
                        </NavLink>
                    </Box>
                ))}
            </Flex>
        </Box>
    );
}

export default Sidebar;
