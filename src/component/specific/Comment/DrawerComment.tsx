import React, { useState, useEffect } from "react";
import {
    Drawer,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    DrawerFooter,
    Textarea,
    Button,
    Text,
    Spinner,
    Badge,
    Box,
    Flex,
    VStack,
    useToast
} from "@chakra-ui/react";
import OwnerTag from "../../generic/ownerTag.tsx";
import { API_URL } from "../../../api/apiUrl.ts";
import { useLocale, useT } from "../../../i18n/index.ts";

const MAX_LENGTH = 200;

type CommentType = {
    id: number;
    comment: string;
    time_stamp: string;
    user: {
        username: string;
        is_botanist: boolean;
    };
};
const API_BASE = API_URL;

// verified botanists' comments come first, each group keeps its order
export const pinBotanistAdvice = <T extends { user: { is_botanist: boolean } }>(comments: T[]): T[] => [
    ...comments.filter((c) => c.user?.is_botanist),
    ...comments.filter((c) => !c.user?.is_botanist),
];
const DrawerComment = ({
                           isOpen,
                           onClose,
                           plantId,
                       }: {
    isOpen: boolean;
    onClose: () => void;
    plantId: number;
}) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const toast = useToast();
    const t = useT();
    const locale = useLocale();

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value.slice(0, MAX_LENGTH));
    };
    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/plants/${plantId}/comments/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            if (!res.ok) throw new Error("Erreur réseau");
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error("Erreur lors du chargement des commentaires", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendComment = async () => {
        if (comment.trim().length === 0) return;
        setIsSending(true);
        try {
            const res = await fetch(`${API_BASE}/comments/?plant_id=${plantId}&comment=${encodeURIComponent(comment.trim())}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // keep the text on failure so the member does not lose what they typed
            if (!res.ok) throw new Error(`Failed with status: ${res.status}`);

            setComment("");
            await fetchComments();
        } catch (err) {
            console.error(err);
            toast({
                title: t("comments.notSent"),
                description: t("comments.notSentText"),
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    return (
        <Drawer onClose={onClose} isOpen={isOpen} placement="right" size={"sm"}>
            <DrawerOverlay />
            <DrawerContent bg="bg.surface">
                <DrawerCloseButton />
                <DrawerHeader fontFamily="heading" fontWeight="normal" borderBottomWidth="1px" borderColor="border.subtle">{t("comments.title")}</DrawerHeader>
                <DrawerBody>
                    {loading ? (
                        <Flex justify="center" py={10}>
                            <Spinner color="brand.600" label={t("comments.loading")} />
                        </Flex>
                    ) : comments.length === 0 ? (
                        <Flex direction="column" align="center" textAlign="center" gap={2} py={10} color="text.muted">
                            <Box as="i" display="inline-block" className="fa-regular fa-comment-dots" fontSize="2xl" color="icon.placeholder" aria-hidden="true" />
                            <Text>{t("comments.empty")}</Text>
                        </Flex>
                    ) : (
                        <VStack as="ul" listStyleType="none" spacing={3} align="stretch">
                            {pinBotanistAdvice(comments).map((c) => (
                                <Box
                                    as="li"
                                    key={c.id}
                                    bg="bg.subtle"
                                    borderRadius="xl"
                                    p={4}
                                    borderLeftWidth={c.user?.is_botanist ? "4px" : 0}
                                    borderLeftColor="brand.600"
                                >
                                    {c.user?.is_botanist && (
                                        <Badge colorScheme="green" borderRadius="full" px={2} mb={2} textTransform="none">
                                            <Box as="i" className="fa-solid fa-thumbtack" mr={1} aria-hidden="true" />
                                            {t("comments.botanistAdvice")}
                                        </Badge>
                                    )}
                                    <Flex justify="space-between" align="center" mb={2} gap={2}>
                                        <OwnerTag name={c.user.username} isBotanist={c.user?.is_botanist} />
                                        <Text as="time" dateTime={c.time_stamp} fontSize="xs" color="text.muted" flexShrink={0}>
                                            {new Date(c.time_stamp).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })}
                                        </Text>
                                    </Flex>
                                    <Text color="text.primary">{c.comment}</Text>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </DrawerBody>
                <DrawerFooter display="grid" gap={2} borderTopWidth="1px" borderColor="border.subtle">
                    <Textarea
                        aria-label={t("comments.yourComment")}
                        placeholder={t("comments.placeholder")}
                        value={comment}
                        onChange={handleCommentChange}
                        size="lg"
                        resize="none"
                    />
                    <Text fontSize="sm" color="text.muted" textAlign="right" aria-live="polite">
                        {t("comments.remaining", { count: MAX_LENGTH - comment.length })}
                    </Text>
                    <Button isDisabled={comment.trim().length === 0} isLoading={isSending} onClick={handleSendComment}>
                        {t("comments.send")}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerComment;
