import {
    Box, Button, Flex, Grid, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentUserStore from "../store/CurrentUser";
import { loginUser, registerUser } from "../api/authQuery.ts";
import { LoginForm } from "../component/specific/login/loginForm.tsx";
import { RegisterForm } from "../component/specific/login/registerForm.tsx";
import ModalRGPD from "../component/specific/RGPDmodale/RGPDModale.tsx";
import Brand from "../component/generic/brand.tsx";
import { ColorModeToggle, LanguageMenu } from "../component/generic/preferences.tsx";
import { isTranslationKey, useT } from "../i18n/index.ts";
import type { FieldChange, RegisterData } from "../component/specific/login/types.ts";
import loginBg from "../assets/login-bg.webp";

const EMPTY_REGISTER: RegisterData = { email: "", username: "", phone: "", password: "", password2: "", is_botanist: false };


export default function LoginPage() {
    const [tabIndex, setTabIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [formRegisterData, setFormRegisterData] = useState(EMPTY_REGISTER);
    const [loginError, setLoginError] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [registerFieldErrors, setRegisterFieldErrors] = useState<{ password2?: string }>({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();
    const setCurrentUser = useCurrentUserStore(state => state.setCurrentUser);
    const t = useT();
    const errorText = (error: unknown, fallback: Parameters<typeof t>[0]) => {
        const message = (error as Error).message;
        return message ? (isTranslationKey(message) ? t(message) : message) : t(fallback);
    };

    const handleTabChange = (index: number) => {
        setTabIndex(index);
        setShowPassword(false);
        setLoginError("");
        setRegisterError("");
        setRegisterFieldErrors({});
    };

    const handleLoginChange: FieldChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange: FieldChange = (e) => {
        const { name, value } = e.target;
        setFormRegisterData(prev => ({ ...prev, [name]: value }));
        if (name === "password2" || name === "password") setRegisterFieldErrors({});
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setIsLoading(true);
        try {
            const data = await loginUser({ email: formData.email, password: formData.password });

            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                setCurrentUser({ email: formData.email, token: data.access_token });
                toast({ title: t("login.success"), status: "success", duration: 3000, isClosable: true });
                navigate("/dashboard");
            }
        } catch (error) {
            setLoginError(errorText(error, "login.genericError"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setRegisterError("");
        if (formRegisterData.password !== formRegisterData.password2) {
            setRegisterFieldErrors({ password2: t("register.passwordMismatch") });
            return;
        }
        setIsLoading(true);
        try {
            await registerUser(formRegisterData);
            toast({
                title: t("register.success"),
                description: t("register.successText"),
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            setFormData({ email: formRegisterData.email, password: "" });
            setFormRegisterData(EMPTY_REGISTER);
            handleTabChange(0);
        } catch (error) {
            setRegisterError(errorText(error, "register.genericError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} minH="100vh">
            <Flex
                display={{ base: "none", lg: "flex" }}
                direction="column"
                justify="space-between"
                p={12}
                bgImage={`linear-gradient(160deg, rgba(5, 46, 22, 0.55), rgba(5, 46, 22, 0.85)), url(${loginBg})`}
                bgSize="cover"
                bgPosition="center"
            >
                <Brand color="white" />
                <Box color="white" maxW="md">
                    <Heading as="p" size="2xl" lineHeight="short" color="white" textShadow="0 2px 12px rgba(0, 0, 0, 0.35)" mb={4}>
                        {t("login.hero")}
                    </Heading>
                    <Text fontSize="lg" color="whiteAlpha.900">
                        {t("login.heroText")}
                    </Text>
                </Box>
            </Flex>

            <Flex align="center" justify="center" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }} position="relative">
                <Flex position="absolute" top={4} right={4} gap={2} align="center">
                    <LanguageMenu />
                    <ColorModeToggle />
                </Flex>
                <Box w="100%" maxW="md" mt={{ base: 10, lg: 0 }}>
                    <Box display={{ base: "block", lg: "none" }} mb={8}>
                        <Brand color="text.brand" />
                    </Box>
                    <Heading as="h1" size="lg" mb={2}>
                        {tabIndex === 0 ? t("login.welcomeBack") : t("login.joinUs")}
                    </Heading>
                    <Text color="text.muted" mb={6}>
                        {tabIndex === 0 ? t("login.signInSubtitle") : t("login.signUpSubtitle")}
                    </Text>

                    <Box bg="bg.surface" borderRadius="2xl" boxShadow="md" border="1px solid" borderColor="border.subtle" p={{ base: 5, md: 8 }}>
                        <Tabs index={tabIndex} onChange={handleTabChange} variant="soft-rounded" colorScheme="brand" isFitted isLazy>
                            <TabList bg="bg.subtle" p={1} borderRadius="full" mb={6}>
                                <Tab color="text.secondary" _selected={{ bg: "bg.surface", color: "text.brand", boxShadow: "sm" }}>{t("login.tabSignIn")}</Tab>
                                <Tab color="text.secondary" _selected={{ bg: "bg.surface", color: "text.brand", boxShadow: "sm" }}>{t("login.tabSignUp")}</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel p={0}>
                                    <LoginForm
                                        formData={formData}
                                        onSubmit={handleLogin}
                                        onChange={handleLoginChange}
                                        isLoading={isLoading}
                                        showPassword={showPassword}
                                        onTogglePassword={() => setShowPassword(!showPassword)}
                                        error={loginError}
                                    />
                                </TabPanel>
                                <TabPanel p={0}>
                                    <RegisterForm
                                        formData={formRegisterData}
                                        onSubmit={handleRegister}
                                        onChange={handleRegisterChange}
                                        isLoading={isLoading}
                                        showPassword={showPassword}
                                        onTogglePassword={() => setShowPassword(!showPassword)}
                                        error={registerError}
                                        fieldErrors={registerFieldErrors}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>

                    <Flex justify="center" mt={6}>
                        <Button variant="link" color="text.brand" fontWeight="medium" onClick={onOpen}>
                            {t("common.privacyPolicy")}
                        </Button>
                    </Flex>
                </Box>
            </Flex>
            <ModalRGPD isOpen={isOpen} onClose={onClose} />
        </Grid>
    );
}
