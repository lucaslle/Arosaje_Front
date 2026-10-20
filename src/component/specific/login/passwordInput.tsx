import { FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useT } from "../../../i18n/index.ts";

export const PasswordInput = ({ name, label, value, onChange, showPassword, onTogglePassword, autoComplete = "", error = "" }) => {
    const t = useT();
    return (
    <FormControl isRequired isInvalid={!!error}>
        <FormLabel htmlFor={name} color="text.secondary" fontWeight="semibold" mb={1}>
            {label}
        </FormLabel>
        <InputGroup size="lg">
            <Input
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                autoComplete={autoComplete}
                pr="3.5rem"
                focusBorderColor="brand.600"
                borderRadius="xl"
            />
            <InputRightElement width="3.5rem">
                <IconButton
                    variant="ghost"
                    size="md"
                    onClick={onTogglePassword}
                    aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                    aria-pressed={showPassword}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    color="text.muted"
                />
            </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
);
};
