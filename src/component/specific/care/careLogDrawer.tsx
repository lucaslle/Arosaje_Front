import {
    Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay,
    Flex, Image, Input, Spinner, Text, Textarea, VStack, useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../api/client.ts";
import { API_URL } from "../../../api/apiUrl.ts";
import type { CareLog } from "../../../api/types.ts";
import { useLocale, useT } from "../../../i18n/index.ts";
import OwnerTag from "../../generic/ownerTag.tsx";

interface CareLogDrawerProps {
    plantId: number;
    isOpen: boolean;
    canWrite: boolean;
    onClose: () => void;
}

const CareLogDrawer = ({ plantId, isOpen, canWrite, onClose }: CareLogDrawerProps) => {
    const [logs, setLogs] = useState<CareLog[]>([]);
    const [text, setText] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);
    const t = useT();
    const locale = useLocale();
    const toast = useToast();

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            setLogs(await api<CareLog[]>(`/plants/${plantId}/care-logs`));
        } catch {
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    }, [plantId]);

    useEffect(() => {
        if (isOpen) load();
    }, [isOpen, load]);

    const send = async () => {
        if (!text.trim()) return;
        const body = new FormData();
        body.append("text", text.trim());
        if (photo) body.append("photo", photo);
        setIsSending(true);
        try {
            const log = await api<CareLog>(`/plants/${plantId}/care-logs`, { method: "POST", body });
            setLogs((current) => [log, ...current]);
            setText("");
            setPhoto(null);
            toast({ title: t("journal.added"), status: "success", duration: 2500, isClosable: true });
        } catch (error) {
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
            <DrawerOverlay />
            <DrawerContent bg="bg.surface">
                <DrawerCloseButton />
                <DrawerHeader fontFamily="heading" fontWeight="normal" borderBottomWidth="1px" borderColor="border.subtle">{t("journal.title")}</DrawerHeader>
                <DrawerBody>
                    {isLoading ? (
                        <Flex justify="center" py={10}><Spinner color="brand.600" /></Flex>
                    ) : logs.length === 0 ? (
                        <Text color="text.muted" textAlign="center" py={10}>{t("journal.empty")}</Text>
                    ) : (
                        <VStack as="ol" listStyleType="none" spacing={4} align="stretch">
                            {logs.map((log) => (
                                <Box as="li" key={log.id} bg="bg.subtle" borderRadius="xl" p={4}>
                                    <Flex justify="space-between" align="center" mb={2} gap={2}>
                                        <OwnerTag name={log.author.username ?? undefined} isBotanist={log.author.is_botanist} />
                                        <Text as="time" dateTime={log.created_at} fontSize="xs" color="text.muted" flexShrink={0}>
                                            {new Date(log.created_at + "Z").toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })}
                                        </Text>
                                    </Flex>
                                    <Text whiteSpace="pre-wrap">{log.text}</Text>
                                    {log.photo_url && (
                                        <Image src={`${API_URL}/${log.photo_url}`} alt={log.text} mt={3} borderRadius="lg" maxH="240px" w="100%" objectFit="cover" loading="lazy" />
                                    )}
                                </Box>
                            ))}
                        </VStack>
                    )}
                </DrawerBody>
                {canWrite && (
                    <DrawerFooter display="grid" gap={2} borderTopWidth="1px" borderColor="border.subtle">
                        <Textarea
                            aria-label={t("journal.placeholder")}
                            placeholder={t("journal.placeholder")}
                            value={text}
                            maxLength={1000}
                            onChange={(e) => setText(e.target.value)}
                            resize="none"
                        />
                        <Input ref={fileInput} type="file" accept="image/*" display="none" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                        <Flex gap={2}>
                            <Button variant="outline" flex={1} leftIcon={<Box as="i" className="fa-solid fa-camera" aria-hidden="true" />} onClick={() => fileInput.current?.click()}>
                                <Text noOfLines={1}>{photo ? photo.name : t("journal.addPhoto")}</Text>
                            </Button>
                            <Button flex={1} isDisabled={!text.trim()} isLoading={isSending} onClick={send}>{t("journal.add")}</Button>
                        </Flex>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default CareLogDrawer;
