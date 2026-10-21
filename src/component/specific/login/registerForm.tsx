import { VStack, Button, Checkbox, Alert, AlertIcon, SimpleGrid, Text } from "@chakra-ui/react";
import { FormInput } from "./formInput.tsx";
import { PasswordInput } from "./passwordInput.tsx";
import { useT } from "../../../i18n/index.ts";
import type { RegisterFormProps } from "./types.ts";

export const RegisterForm = ({ formData, onSubmit, onChange, isLoading, showPassword, onTogglePassword, error, fieldErrors }: RegisterFormProps) => {
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
                name="username"
                label={t("common.username")}
                autoComplete="username"
                value={formData.username}
                onChange={onChange}
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
                <FormInput
                    name="email"
                    label={t("common.email")}
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={onChange}
                />
                <FormInput
                    name="phone"
                    label={t("common.phone")}
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={onChange}
                />
            </SimpleGrid>
            <PasswordInput
                name="password"
                label={t("common.password")}
                autoComplete="new-password"
                value={formData.password}
                onChange={onChange}
                showPassword={showPassword}
                onTogglePassword={onTogglePassword}
            />
            <PasswordInput
                name="password2"
                label={t("register.confirmPassword")}
                autoComplete="new-password"
                value={formData.password2}
                onChange={onChange}
                showPassword={showPassword}
                onTogglePassword={onTogglePassword}
                error={fieldErrors.password2}
            />
            <Checkbox
                alignSelf="flex-start"
                colorScheme="brand"
                size="lg"
                isChecked={formData.is_botanist}
                onChange={(e) => onChange({ target: { name: "is_botanist", value: e.target.checked } })}
            >
                <Text color="text.secondary">{t("register.isBotanist")}</Text>
            </Checkbox>
            {formData.is_botanist && <Text fontSize="sm" color="text.muted" alignSelf="flex-start" mt={-3}>{t("register.botanistHelp")}</Text>}
            <Button
                type="submit"
                isLoading={isLoading}
                loadingText={t("register.submitting")}
                size="lg"
                width="100%"
                borderRadius="xl"
                bg="brand.700"
                color="white"
                _hover={{ bg: "brand.800" }}
                _active={{ bg: "brand.900" }}
            >
                {t("register.submit")}
            </Button>
        </VStack>
    </form>
);
};
