import {
    Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay,
    Flex, Spinner, Text, Textarea, VStack, useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { api, jsonBody } from "../../../api/client.ts";
import type { Message } from "../../../api/types.ts";
import { useLocale, useT } from "../../../i18n/index.ts";
import { useMeStore } from "../../../store/me.ts";

interface MessagesDrawerProps {
    offerId: number | null;
    title: string;
    canSend: boolean;
    onClose: () => void;
}

const MessagesDrawer = ({ offerId, title, canSend, onClose }: MessagesDrawerProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const meId = useMeStore((state) => state.me?.id);
    const t = useT();
    const locale = useLocale();
    const toast = useToast();

    const load = useCallback(async () => {
        if (offerId === null) return;
        setIsLoading(true);
        try {
            setMessages(await api<Message[]>(`/care-offers/${offerId}/messages`));
        } finally {
            setIsLoading(false);
        }
    }, [offerId]);

    useEffect(() => {
        load();
    }, [load]);

    const send = async () => {
        if (offerId === null || !text.trim()) return;
        setIsSending(true);
        try {
            const message = await api<Message>(`/care-offers/${offerId}/messages`, { method: "POST", body: jsonBody({ text: text.trim() }) });
            setMessages((current) => [...current, message]);
            setText("");
        } catch (error) {
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Drawer isOpen={offerId !== null} onClose={onClose} placement="right" size="sm">
            <DrawerOverlay />
            <DrawerContent bg="bg.surface">
                <DrawerCloseButton />
                <DrawerHeader fontFamily="heading" fontWeight="normal" borderBottomWidth="1px" borderColor="border.subtle">{title}</DrawerHeader>
                <DrawerBody>
                    {isLoading ? (
                        <Flex justify="center" py={10}><Spinner color="brand.600" /></Flex>
                    ) : messages.length === 0 ? (
                        <Text color="text.muted" textAlign="center" py={10}>{t("messages.empty")}</Text>
                    ) : (
                        <VStack as="ol" listStyleType="none" spacing={3} align="stretch" aria-live="polite">
                            {messages.map((message) => {
                                const mine = message.sender.id === meId;
                                return (
                                    <Box
                                        as="li"
                                        key={message.id}
                                        alignSelf={mine ? "flex-end" : "flex-start"}
                                        maxW="85%"
                                        bg={mine ? "brand.700" : "bg.subtle"}
                                        color={mine ? "white" : "text.primary"}
                                        borderRadius="xl"
                                        px={4}
                                        py={2}
                                    >
                                        {!mine && <Text fontSize="xs" fontWeight="bold" mb={1}>{message.sender.username}</Text>}
                                        <Text whiteSpace="pre-wrap">{message.text}</Text>
                                        <Text as="time" dateTime={message.created_at} fontSize="xs" opacity={0.8}>
                                            {new Date(message.created_at + "Z").toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })}
                                        </Text>
                                    </Box>
                                );
                            })}
                        </VStack>
                    )}
                </DrawerBody>
                <DrawerFooter display="grid" gap={2} borderTopWidth="1px" borderColor="border.subtle">
                    {canSend ? (
                        <>
                            <Textarea
                                aria-label={t("messages.placeholder")}
                                placeholder={t("messages.placeholder")}
                                value={text}
                                maxLength={1000}
                                onChange={(e) => setText(e.target.value)}
                                resize="none"
                            />
                            <Button isDisabled={!text.trim()} isLoading={isSending} onClick={send}>{t("comments.send")}</Button>
                        </>
                    ) : (
                        <Text color="text.muted">{t("messages.closed")}</Text>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default MessagesDrawer;
