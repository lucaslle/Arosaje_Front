import { VStack, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { FormInput } from "./formInput.tsx";
import { PasswordInput } from "./passwordInput.tsx";
import { useT } from "../../../i18n/index.ts";
import type { LoginFormProps } from "./types.ts";

export const LoginForm = ({ formData, onSubmit, onChange, isLoading, showPassword, onTogglePassword, error }: LoginFormProps) => {
    const t = useT();
    return (
    <form onSubmit={onSubmit}>
        <VStack spacing={5} w="100%">
            {error && (
                <Alert status="error" borderRadius="xl" role="alert">
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <FormInput
                name="email"
                label={t("common.email")}
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={onChange}
            />
            <PasswordInput
                name="password"
                label={t("common.password")}
                autoComplete="current-password"
                value={formData.password}
                onChange={onChange}
                showPassword={showPassword}
                onTogglePassword={onTogglePassword}
            />
            <Button
                type="submit"
                isLoading={isLoading}
                loadingText={t("login.submitting")}
                size="lg"
                width="100%"
                borderRadius="xl"
                bg="brand.700"
                color="white"
                _hover={{ bg: "brand.800" }}
                _active={{ bg: "brand.900" }}
            >
                {t("login.submit")}
            </Button>
        </VStack>
    </form>
);
};
