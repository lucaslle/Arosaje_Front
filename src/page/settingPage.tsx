import { Box, Button, ButtonGroup, Flex, Grid, Heading, Skeleton, Text, VStack, useColorMode, useColorModeValue, useToast } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountSettings } from "../component/specific/settings/accountSetting.tsx";
import { PasswordForm } from "../component/specific/settings/passwordForm.tsx";
import { api, jsonBody } from "../api/client.ts";
import { signOut, useMeStore } from "../store/me.ts";
import { UserInfo, UserInfoForm } from "../component/specific/settings/userInfoForm.tsx";
import { LanguageMenu } from "../component/generic/preferences.tsx";
import { useT } from "../i18n/index.ts";


function SettingPage() {
    const [values, setValues] = useState<UserInfo>({ username: "", email: "", phone: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const me = useMeStore((state) => state.me);
    const userId = me?.id ?? null;
    const toast = useToast();
    const navigate = useNavigate();
    const t = useT();
    const { colorMode, setColorMode } = useColorMode();
    const [skeletonStart, skeletonEnd] = useColorModeValue(["brand.50", "brand.100"], ["whiteAlpha.100", "whiteAlpha.200"]);

    // the signed-in member is already loaded by the layout
    useEffect(() => {
        if (me) setValues({ username: me.username, email: me.email, phone: me.phone });
    }, [me]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (userId === null) return;
        setIsSaving(true);
        try {
            // in the body: e-mail and phone must never appear in a URL, which the server logs
            await api(`/users/${userId}`, { method: "PUT", body: jsonBody(values) });
            toast({ title: t("settings.saved"), status: "success", duration: 3000, isClosable: true });
            useMeStore.getState().load();
        } catch (error) {
            toast({ title: t("settings.saveError"), description: (error as Error).message, status: "error", duration: 5000, isClosable: true });
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await api<unknown>("/users/me/export");
            const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = "arosaje-mes-donnees.json";
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            toast({ title: t("settings.exportError"), description: (error as Error).message, status: "error", duration: 5000, isClosable: true });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async () => {
        if (userId === null) return;
        setIsDeleting(true);
        try {
            await api(`/users/?id=${userId}`, { method: "DELETE" });
            signOut();
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
                {me?.is_botanist && (
                    <Text mt={4} fontSize="sm" color={me.botanist_verified ? "text.brand" : "text.muted"}>
                        <Box as="i" className={`fa-solid ${me.botanist_verified ? "fa-circle-check" : "fa-hourglass-half"}`} mr={2} aria-hidden="true" />
                        {me.botanist_verified ? t("settings.botanistVerified") : t("settings.botanistPending")}
                    </Text>
                )}

                <Heading as="h2" size="sm" mt={10} mb={6}>{t("settings.password")}</Heading>
                <PasswordForm />
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
                    <AccountSettings onDelete={handleDelete} isDeleting={isDeleting} onExport={handleExport} isExporting={isExporting} />
                </Box>
            </VStack>
        </Grid>
    );
}

export default SettingPage;
