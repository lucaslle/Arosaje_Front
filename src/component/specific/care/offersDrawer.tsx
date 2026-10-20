import {
    Badge, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay,
    Flex, Spinner, Text, Textarea, VStack, useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { api, jsonBody } from "../../../api/client.ts";
import type { CareOffer, OfferStatus } from "../../../api/types.ts";
import { TranslationKey, useT } from "../../../i18n/index.ts";
import OwnerTag from "../../generic/ownerTag.tsx";
import MessagesDrawer from "./messagesDrawer.tsx";
import { SitterRating, StarInput } from "./rating.tsx";

const STATUS_COLORS: Record<OfferStatus, string> = {
    pending: "orange",
    accepted: "green",
    completed: "blue",
    refused: "gray",
    cancelled: "gray",
};

interface OffersDrawerProps {
    plantId: number;
    isOpen: boolean;
    onClose: () => void;
    onCareChanged: () => void;
}

const ReviewForm = ({ offerId, onDone }: { offerId: number; onDone: () => void }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSending, setIsSending] = useState(false);
    const t = useT();
    const toast = useToast();

    const send = async () => {
        setIsSending(true);
        try {
            await api(`/care-offers/${offerId}/review`, { method: "POST", body: jsonBody({ rating, comment: comment.trim() || null }) });
            toast({ title: t("review.sent"), status: "success", duration: 3000, isClosable: true });
            onDone();
        } catch (error) {
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <VStack align="stretch" spacing={2} mt={3} p={3} borderRadius="lg" borderWidth="1px" borderColor="border.subtle">
            <Text fontWeight="semibold">{t("review.title")}</Text>
            <StarInput value={rating} onChange={setRating} />
            <Textarea aria-label={t("review.commentPlaceholder")} placeholder={t("review.commentPlaceholder")} value={comment} maxLength={1000} onChange={(e) => setComment(e.target.value)} resize="none" size="sm" />
            <Button size="sm" isDisabled={rating === 0} isLoading={isSending} onClick={send}>{t("review.submit")}</Button>
        </VStack>
    );
};

const OffersDrawer = ({ plantId, isOpen, onClose, onCareChanged }: OffersDrawerProps) => {
    const [offers, setOffers] = useState<CareOffer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [chat, setChat] = useState<CareOffer | null>(null);
    const t = useT();
    const toast = useToast();

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            setOffers(await api<CareOffer[]>(`/plants/${plantId}/care-offers`));
        } finally {
            setIsLoading(false);
        }
    }, [plantId]);

    useEffect(() => {
        if (isOpen) load();
    }, [isOpen, load]);

    const run = async (offerId: number, request: () => Promise<unknown>, success: TranslationKey) => {
        setBusyId(offerId);
        try {
            await request();
            toast({ title: t(success), status: "success", duration: 2500, isClosable: true });
            await load();
            onCareChanged();
        } catch (error) {
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <>
            <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
                <DrawerOverlay />
                <DrawerContent bg="bg.surface">
                    <DrawerCloseButton />
                    <DrawerHeader fontFamily="heading" fontWeight="normal" borderBottomWidth="1px" borderColor="border.subtle">{t("care.offersTitle")}</DrawerHeader>
                    <DrawerBody>
                        {isLoading ? (
                            <Flex justify="center" py={10}><Spinner color="brand.600" /></Flex>
                        ) : offers.length === 0 ? (
                            <Text color="text.muted" textAlign="center" py={10}>{t("care.noOffers")}</Text>
                        ) : (
                            <VStack as="ul" listStyleType="none" spacing={3} align="stretch">
                                {offers.map((offer) => (
                                    <Box as="li" key={offer.id} bg="bg.subtle" borderRadius="xl" p={4}>
                                        <Flex justify="space-between" align="center" gap={2} mb={1}>
                                            <OwnerTag name={offer.sitter.username ?? undefined} isBotanist={offer.sitter.is_botanist} />
                                            <Badge colorScheme={STATUS_COLORS[offer.status]} borderRadius="full" px={2} textTransform="none">
                                                {t(`care.status.${offer.status}` as TranslationKey)}
                                            </Badge>
                                        </Flex>
                                        <SitterRating sitter={offer.sitter} />
                                        <Flex gap={2} mt={3} wrap="wrap">
                                            {offer.status === "pending" && (
                                                <>
                                                    <Button size="sm" isLoading={busyId === offer.id} onClick={() => run(offer.id, () => api(`/care-offers/${offer.id}/accept`, { method: "PUT" }), "care.accepted")}>
                                                        {t("care.accept")}
                                                    </Button>
                                                    <Button size="sm" variant="outline" isDisabled={busyId === offer.id} onClick={() => run(offer.id, () => api(`/care-offers/${offer.id}/refuse`, { method: "PUT" }), "care.status.refused")}>
                                                        {t("care.refuse")}
                                                    </Button>
                                                </>
                                            )}
                                            {offer.status === "accepted" && (
                                                <Button size="sm" variant="outline" isLoading={busyId === offer.id} onClick={() => run(offer.id, () => api(`/plants/${plantId}/end-care`, { method: "PUT" }), "care.ended")}>
                                                    {t("care.end")}
                                                </Button>
                                            )}
                                            {(offer.status === "pending" || offer.status === "accepted" || offer.status === "completed") && (
                                                <Button size="sm" variant="ghost" leftIcon={<Box as="i" className="fa-regular fa-envelope" aria-hidden="true" />} onClick={() => setChat(offer)}>
                                                    {t("messages.open")}
                                                </Button>
                                            )}
                                        </Flex>
                                        {offer.status === "completed" && !offer.has_review && <ReviewForm offerId={offer.id} onDone={load} />}
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <MessagesDrawer
                offerId={chat?.id ?? null}
                title={t("messages.title", { name: chat?.sitter.username ?? "" })}
                canSend={chat?.status === "pending" || chat?.status === "accepted"}
                onClose={() => setChat(null)}
            />
        </>
    );
};

export default OffersDrawer;
