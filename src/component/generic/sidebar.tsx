import { Box, Button, Flex, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { NavLink } from 'react-router-dom';
import Brand from './brand.tsx';
import AddModal from '../specific/addModal.tsx';
import { TranslationKey, useT } from '../../i18n/index.ts';
import { isVerifiedBotanist, useMeStore } from '../../store/me.ts';

export const SIDEBAR_WIDTH = 64;

// secondary items stay out of the mobile tab bar (5 slots max); the account menu lists them there
interface MenuItem { id: string; label: TranslationKey; icon: string; href: string; secondary?: boolean }

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'nav.dashboard', icon: 'fa-solid fa-gauge', href: '/dashboard' },
    { id: 'myplants', label: 'nav.myPlants', icon: 'fa-solid fa-house', href: '/myplants' },
    { id: 'allplants', label: 'nav.plants', icon: 'fa-solid fa-seedling', href: '/all_plants' },
    { id: 'plantscare', label: 'nav.plantSitting', icon: 'fa-solid fa-hand-holding-heart', href: '/care-requests' },
    { id: 'favourites', label: 'nav.favourites', icon: 'fa-solid fa-heart', href: '/like', secondary: true },
    { id: 'setting', label: 'nav.settings', icon: 'fa-solid fa-gear', href: '/setting', secondary: true }
];
export const ADVICE_ITEM: MenuItem = { id: 'advice', label: 'nav.advice', icon: 'fa-solid fa-user-doctor', href: '/advice', secondary: true };
export const ADMIN_ITEM: MenuItem = { id: 'admin', label: 'nav.admin', icon: 'fa-solid fa-user-shield', href: '/admin', secondary: true };

function Sidebar() {
    const t = useT();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const me = useMeStore((state) => state.me);
    const items = [
        ...menuItems.slice(0, -1),
        ...(isVerifiedBotanist(me) ? [ADVICE_ITEM] : []),
        ...(me?.is_admin ? [ADMIN_ITEM] : []),
        menuItems[menuItems.length - 1],
    ];
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

            <Button display={{ base: "none", md: "flex" }} w="100%" size="lg" leftIcon={<AddIcon boxSize={3} />} onClick={onOpen} mb={4}>
                {t("header.addPlant")}
            </Button>

            <Flex as="ul" listStyleType="none" direction={{ base: "row", md: "column" }} gap={{ base: 0, md: 1 }} h={{ base: "100%", md: "auto" }}>
                <Box as="li" display={{ base: "flex", md: "none" }} flex={1} alignItems="center" justifyContent="center">
                    <IconButton aria-label={t("header.addPlant")} icon={<AddIcon boxSize={3} />} isRound onClick={onOpen} />
                </Box>
                {items.map((item) => (
                    <Box as="li" key={item.id} flex={{ base: 1, md: "none" }} display={{ base: item.secondary ? "none" : "block", md: "block" }}>
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
            <AddModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}

export default Sidebar;
