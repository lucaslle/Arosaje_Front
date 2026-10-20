import { Box, Button, ButtonGroup, Flex, Grid, Heading, Skeleton, Text, VStack, useColorMode, useColorModeValue, useToast } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountSettings } from "../component/specific/settings/accountSetting.tsx";
import { UserInfo, UserInfoForm } from "../component/specific/settings/userInfoForm.tsx";
import { API_URL } from "../api/apiUrl.ts";
import { apiErrorMessage } from "../api/apiError.ts";
import useCurrentUserStore from "../store/CurrentUser.ts";
import { LanguageMenu } from "../component/generic/preferences.tsx";
import { useT } from "../i18n/index.ts";

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

function SettingPage() {
    const [userId, setUserId] = useState<number | null>(null);
    const [values, setValues] = useState<UserInfo>({ username: "", email: "", phone: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const logout = useCurrentUserStore((state) => state.logout);
    const t = useT();
    const { colorMode, setColorMode } = useColorMode();
    const [skeletonStart, skeletonEnd] = useColorModeValue(["brand.50", "brand.100"], ["whiteAlpha.100", "whiteAlpha.200"]);

    useEffect(() => {
        const fetchMe = async () => {
            const response = await fetch(`${API_URL}/users/me/`, { headers: authHeaders() });
            if (response.status === 401) {
                navigate("/login");
                return;
            }
            if (!response.ok) {
                toast({ title: t("settings.loadError"), status: "error", duration: 4000, isClosable: true });
                return;
            }
            const me = await response.json();
            setUserId(me.id);
            setValues({ username: me.username, email: me.email, phone: me.phone });
        };
        fetchMe();
    }, [navigate, toast, t]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (userId === null) return;
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/users/${userId}?${new URLSearchParams({ ...values })}`, {
                method: "PUT",
                headers: authHeaders(),
            });
            if (!response.ok) {
                throw new Error(apiErrorMessage(await response.json(), t("settings.checkFields")));
            }
            toast({ title: t("settings.saved"), status: "success", duration: 3000, isClosable: true });
        } catch (error) {
            toast({ title: t("settings.saveError"), description: (error as Error).message, status: "error", duration: 5000, isClosable: true });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (userId === null) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${API_URL}/users/?id=${userId}`, { method: "DELETE", headers: authHeaders() });
            if (!response.ok) throw new Error(`Failed with status: ${response.status}`);
            localStorage.removeItem("token");
            logout();
            toast({ title: t("settings.deleted"), status: "success", duration: 3000, isClosable: true });
            navigate("/login", { replace: true });
        } catch {
            toast({ title: t("settings.deleteError"), description: t("settings.retryLater"), status: "error", duration: 5000, isClosable: true });
            setIsDeleting(false);
        }
    };

    return (
        <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={8} alignItems="start">
            <Box bg="bg.surface" borderWidth="1px" borderColor="border.subtle" borderRadius="card" boxShadow="card" p={{ base: 5, md: 8 }}>
                <Heading as="h2" size="sm" mb={6}>{t("settings.myInfo")}</Heading>
                {userId === null ? (
                    <Skeleton h="280px" borderRadius="xl" startColor={skeletonStart} endColor={skeletonEnd} />
                ) : (
                    <UserInfoForm values={values} onChange={handleChange} onSubmit={handleSubmit} isSaving={isSaving} />
                )}
            </Box>

            <VStack spacing={8} align="stretch">
                <Box bg="bg.surface" borderWidth="1px" borderColor="border.subtle" borderRadius="card" boxShadow="card" p={{ base: 5, md: 8 }}>
                    <Heading as="h2" size="sm" mb={6}>{t("settings.preferences")}</Heading>
                    <VStack spacing={5} align="stretch">
                        <Flex justify="space-between" align="center" gap={4}>
                            <Text fontWeight="medium">{t("prefs.language")}</Text>
                            <LanguageMenu showName />
                        </Flex>
                        <Flex justify="space-between" align="center" gap={4}>
                            <Text fontWeight="medium" id="settings-theme-label">{t("settings.theme")}</Text>
                            <ButtonGroup size="sm" isAttached variant="outline" role="group" aria-labelledby="settings-theme-label">
                                {(["light", "dark"] as const).map((mode) => (
                                    <Button
                                        key={mode}
                                        aria-pressed={colorMode === mode}
                                        variant={colorMode === mode ? "solid" : "outline"}
                                        onClick={() => setColorMode(mode)}
                                    >
                                        {mode === "light" ? t("settings.themeLight") : t("settings.themeDark")}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Flex>
                    </VStack>
                </Box>

                <Box bg="bg.surface" borderWidth="1px" borderColor="border.subtle" borderRadius="card" boxShadow="card" p={{ base: 5, md: 8 }}>
                    <Heading as="h2" size="sm" mb={6}>{t("settings.account")}</Heading>
                    <AccountSettings onDelete={handleDelete} isDeleting={isDeleting} />
                </Box>
            </VStack>
        </Grid>
    );
}

export default SettingPage;
