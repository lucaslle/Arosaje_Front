import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Button, HStack, Text, VStack, useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useT } from "../../../i18n/index.ts";

interface AccountSettingsProps {
    onDelete: () => Promise<void>;
    isDeleting: boolean;
}

export const AccountSettings = ({ onDelete, isDeleting }: AccountSettingsProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const t = useT();

    return (
        <VStack align="start" spacing={4}>
            <HStack justify="space-between" w="100%" gap={4}>
                <Text color="text.secondary">{t("settings.deleteText")}</Text>
                <Button colorScheme="red" variant="outline" size="sm" flexShrink={0} onClick={onOpen}>
                    {t("settings.delete")}
                </Button>
            </HStack>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent mx={4}>
                        <AlertDialogHeader fontFamily="heading" fontWeight="normal">{t("settings.deleteTitle")}</AlertDialogHeader>
                        <AlertDialogBody>
                            {t("settings.deleteWarning")}
                        </AlertDialogBody>
                        <AlertDialogFooter gap={3}>
                            <Button ref={cancelRef} variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
                            <Button colorScheme="red" bg="red.600" _hover={{ bg: "red.700" }} isLoading={isDeleting} onClick={onDelete}>
                                {t("settings.deleteConfirm")}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
};
