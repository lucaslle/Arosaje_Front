import {
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Icon,
    useToast,
} from "@chakra-ui/react";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useCurrentUserStore from "../../store/CurrentUser.ts";
import { useT } from "../../i18n/index.ts";
import {FC} from "react";

interface AvatarMenuProps {
    avatarUrl?: string;
    email?: string;
}

const AvatarMenu: FC<AvatarMenuProps> = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const user = useCurrentUserStore(state => state.user);

    const logout = useCurrentUserStore(state => state.logout);
    const t = useT();

    // stateless JWT: the API has no logout route, clearing the token is the logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
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
        <Menu>
            <MenuButton aria-label={t("header.accountMenu")} borderRadius="full" _focusVisible={{ boxShadow: "outline" }}>
                <Avatar
                    size="sm"
                    name={user?.email}
                    bg="brand.700"
                    color="white"
                />
            </MenuButton>
            <MenuList color="text.primary">
                <MenuItem
                    icon={<Icon as={FiSettings} />}
                    onClick={handleSettingClick}
                    fontWeight="bold"
                >
                    {t("nav.settings")}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    icon={<Icon as={FiLogOut} />}
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