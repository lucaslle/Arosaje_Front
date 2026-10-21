import {
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Box,
    useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n/index.ts";
import { isVerifiedBotanist, signOut, useMeStore } from "../../store/me.ts";
import { ADMIN_ITEM, ADVICE_ITEM } from "./sidebar.tsx";
import {FC} from "react";

interface AvatarMenuProps {
    avatarUrl?: string;
    email?: string;
}

const AvatarMenu: FC<AvatarMenuProps> = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const t = useT();
    const me = useMeStore((state) => state.me);
    // pages left out of the mobile tab bar
    const mobileLinks = [
        { href: "/like", label: t("nav.favourites"), icon: "fa-solid fa-heart" },
        ...(isVerifiedBotanist(me) ? [{ href: ADVICE_ITEM.href, label: t(ADVICE_ITEM.label), icon: ADVICE_ITEM.icon }] : []),
        ...(me?.is_admin ? [{ href: ADMIN_ITEM.href, label: t(ADMIN_ITEM.label), icon: ADMIN_ITEM.icon }] : []),
    ];

    // stateless JWT: the API has no logout route, clearing the token is the logout
    const handleLogout = () => {
        signOut();
        toast({
            title: t("header.logoutSuccess"),
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        navigate("/login", { replace: true });
    };
    const handleSettingClick = () => {
        navigate("/setting");
    };

    return (
        <Menu placement="bottom-end" isLazy>
            <MenuButton aria-label={t("header.accountMenu")} borderRadius="full" _focusVisible={{ boxShadow: "outline" }}>
                <Avatar
                    size="sm"
                    name={me?.username ?? me?.email}
                    bg="brand.700"
                    color="white"
                />
            </MenuButton>
            <MenuList color="text.primary">
                {mobileLinks.map((link) => (
                    <MenuItem
                        key={link.href}
                        display={{ base: "flex", md: "none" }}
                        icon={<Box as="i" className={link.icon} aria-hidden="true" w={4} textAlign="center" />}
                        onClick={() => navigate(link.href)}
                        fontWeight="bold"
                    >
                        {link.label}
                    </MenuItem>
                ))}
                <MenuItem
                    icon={<Box as="i" className="fa-solid fa-gear" aria-hidden="true" w={4} textAlign="center" />}
                    onClick={handleSettingClick}
                    fontWeight="bold"
                >
                    {t("nav.settings")}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    icon={<Box as="i" className="fa-solid fa-right-from-bracket" aria-hidden="true" w={4} textAlign="center" />}
                    onClick={handleLogout}
                    fontWeight="bold"
                >
                    {t("header.logout")}
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default AvatarMenu;