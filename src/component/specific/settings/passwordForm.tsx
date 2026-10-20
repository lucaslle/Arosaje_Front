import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, VStack, useToast } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { ApiError, api, jsonBody } from "../../../api/client.ts";
import { useT } from "../../../i18n/index.ts";

export const PasswordForm = () => {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();
    const t = useT();

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (next.length < 8) {
            setError(t("settings.passwordTooShort"));
            return;
        }
        setIsSaving(true);
        setError("");
        try {
            await api("/users/me/password", { method: "PUT", body: jsonBody({ current_password: current, new_password: next }) });
            setCurrent("");
            setNext("");
            toast({ title: t("settings.passwordChanged"), status: "success", duration: 3000, isClosable: true });
        } catch (err) {
            setError(err instanceof ApiError && err.status === 400 ? t("settings.wrongPassword") : (err as Error).message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={submit}>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={error === t("settings.wrongPassword")}>
                    <FormLabel htmlFor="current-password">{t("settings.currentPassword")}</FormLabel>
                    <Input id="current-password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
                    <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!error && error !== t("settings.wrongPassword")}>
                    <FormLabel htmlFor="new-password">{t("settings.newPassword")}</FormLabel>
                    <Input id="new-password" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
                    {error && error !== t("settings.wrongPassword") ? <FormErrorMessage>{error}</FormErrorMessage> : <FormHelperText>{t("settings.passwordHelp")}</FormHelperText>}
                </FormControl>
                <Button type="submit" isLoading={isSaving} alignSelf="flex-start">{t("settings.changePassword")}</Button>
            </VStack>
        </form>
    );
};
