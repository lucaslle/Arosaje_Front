import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import type { FieldProps } from "./types.ts";

export const FormInput = ({ name, label, value, onChange, type = "text", autoComplete = "", error = "" }: FieldProps & { type?: string }) => (
    <FormControl isRequired isInvalid={!!error}>
        <FormLabel htmlFor={name} color="text.secondary" fontWeight="semibold" mb={1}>
            {label}
        </FormLabel>
        <Input
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            autoComplete={autoComplete}
            size="lg"
            focusBorderColor="brand.600"
            borderRadius="xl"
        />
        <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
);
