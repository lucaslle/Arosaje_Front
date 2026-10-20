import { VStack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { ChangeEvent, FormEvent } from "react";
import { useT } from "../../../i18n/index.ts";

export interface UserInfo {
    username: string;
    email: string;
    phone: string;
}

interface UserInfoFormProps {
    values: UserInfo;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
    isSaving: boolean;
}

export const UserInfoForm = ({ values, onChange, onSubmit, isSaving }: UserInfoFormProps) => {
    const t = useT();
    return (
    <form onSubmit={onSubmit}>
        <VStack spacing={4} align="stretch">
            <FormControl isRequired>
                <FormLabel htmlFor="settings-username">{t("common.username")}</FormLabel>
                <Input id="settings-username" name="username" autoComplete="username" value={values.username} onChange={onChange} />
            </FormControl>

            <FormControl isRequired>
                <FormLabel htmlFor="settings-email">{t("common.email")}</FormLabel>
                <Input id="settings-email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} />
            </FormControl>

            <FormControl isRequired>
                <FormLabel htmlFor="settings-phone">{t("common.phone")}</FormLabel>
                <Input id="settings-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={onChange} />
            </FormControl>

            <Button type="submit" leftIcon={<FaSave />} isLoading={isSaving} loadingText={t("settings.saving")} mt={2}>
                {t("settings.saveInfo")}
            </Button>
        </VStack>
    </form>
    );
};
