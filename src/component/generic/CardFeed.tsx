import { Badge, Box, Button, Card, CardBody, CardFooter, Flex, Heading, IconButton, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import DrawerComment from "../specific/Comment/DrawerComment.tsx";
import CareLogDrawer from "../specific/care/careLogDrawer.tsx";
import MessagesDrawer from "../specific/care/messagesDrawer.tsx";
import PlantPhoto from "./plantPhoto.tsx";
import OwnerTag from "./ownerTag.tsx";
import { api } from "../../api/client.ts";
import type { MyCareOffer, Plant } from "../../api/types.ts";
import { useFormatDay, useT } from "../../i18n/index.ts";

export type CareAction = "sitting" | "offer_pending" | "can_offer" | "none";

// what the signed-in member can do about looking after this plant
export const careAction = (plant: Pick<Plant, "owner_id" | "in_care_id" | "care_requested">, meId: number | null, myOffer?: Pick<MyCareOffer, "status">): CareAction => {
    if (meId === null) return "none";
    if (plant.in_care_id === meId) return "sitting";
    if (myOffer?.status === "pending") return "offer_pending";
    if (plant.care_requested && plant.in_care_id === null && plant.owner_id !== meId) return "can_offer";
    return "none";
};

interface CardFeedProps {
    plant: Plant;
    meId: number | null;
    myOffer?: MyCareOffer;
    isFavorite: boolean;
    onToggleFavorite: (plantId: number, favorite: boolean) => void;
    onOffersChanged: () => void;
}

const CardFeed = ({ plant, meId, myOffer, isFavorite, onToggleFavorite, onOffersChanged }: CardFeedProps) => {
    const comments = useDisclosure();
    const journal = useDisclosure();
    const [chatOpen, setChatOpen] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const toast = useToast();
    const t = useT();
    const formatDay = useFormatDay();
    const action = careAction(plant, meId, myOffer);

    const offer = async () => {
        setIsBusy(true);
        try {
            if (action === "offer_pending" && myOffer) {
                await api(`/care-offers/${myOffer.id}`, { method: "DELETE" });
            } else {
                await api(`/plants/${plant.id}/care-offers`, { method: "POST" });
                toast({ title: t("care.offerSentToast"), status: "success", duration: 2500, isClosable: true });
            }
            onOffersChanged();
        } catch (error) {
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <>
            <Card overflow="hidden" h="100%" transition="box-shadow 200ms ease, transform 200ms ease" _hover={{ boxShadow: "cardHover", transform: "translateY(-2px)" }}>
                <Box position="relative">
                    <PlantPhoto url={plant.photo_url ?? ""} alt={plant.name} />
                    <IconButton
                        icon={<Box as="i" display="inline-block" className={`fa-${isFavorite ? "solid" : "regular"} fa-heart`} color={isFavorite ? "red.500" : "gray.700"} />}
                        position="absolute"
                        top={3}
                        right={3}
                        isRound
                        bg="whiteAlpha.900"
                        _hover={{ bg: "white" }}
                        boxShadow="sm"
                        aria-label={isFavorite ? t("favourites.remove") : t("favourites.add")}
                        aria-pressed={isFavorite}
                        onClick={() => onToggleFavorite(plant.id, !isFavorite)}
                    />
                    {(plant.care_requested || plant.in_care) && (
                        <Badge position="absolute" top={3} left={3} bg={plant.in_care ? "brand.700" : "accent.500"} color={plant.in_care ? "white" : "black"} borderRadius="full" px={3} py={1} textTransform="none" fontSize="xs">
                            {plant.in_care ? t("plant.inCare") : t("plant.careRequested")}
                        </Badge>
                    )}
                </Box>
                <CardBody px={4} py={3}>
                    <Heading as="h3" size="sm" noOfLines={1} mb={1}>{plant.name}</Heading>
                    <Flex align="center" gap={2} fontSize="sm" color="text.muted">
                        <Box as="i" display="inline-block" className="fa-solid fa-location-dot" aria-hidden="true" />
                        <Text noOfLines={1}>{plant.location}</Text>
                    </Flex>
                    {plant.care_start && plant.care_end && (
                        <Flex align="center" gap={2} fontSize="sm" color="text.muted" mt={1}>
                            <Box as="i" display="inline-block" className="fa-regular fa-calendar" aria-hidden="true" />
                            <Text>{t("care.dates", { start: formatDay(plant.care_start), end: formatDay(plant.care_end) })}</Text>
                        </Flex>
                    )}
                    {action === "can_offer" && (
                        <Button size="sm" w="100%" mt={3} isLoading={isBusy} leftIcon={<Box as="i" className="fa-solid fa-hand-holding-heart" aria-hidden="true" />} onClick={offer}>
                            {t("care.offer")}
                        </Button>
                    )}
                    {action === "offer_pending" && (
                        <Flex mt={3} gap={2} align="center" wrap="wrap">
                            <Badge colorScheme="orange" borderRadius="full" px={2} textTransform="none">{t("care.offerSent")}</Badge>
                            <Button size="xs" variant="ghost" onClick={() => setChatOpen(true)}>{t("messages.open")}</Button>
                            <Button size="xs" variant="ghost" colorScheme="red" isLoading={isBusy} onClick={offer}>{t("care.withdraw")}</Button>
                        </Flex>
                    )}
                    {action === "sitting" && (
                        <Flex mt={3} gap={2} align="center" wrap="wrap">
                            <Badge colorScheme="green" borderRadius="full" px={2} textTransform="none">{t("care.youCare")}</Badge>
                            <Button size="xs" variant="ghost" onClick={journal.onOpen}>{t("journal.title")}</Button>
                            {myOffer && <Button size="xs" variant="ghost" onClick={() => setChatOpen(true)}>{t("messages.open")}</Button>}
                        </Flex>
                    )}
                </CardBody>
                <CardFooter px={4} py={3} borderTopWidth="1px" borderColor="border.subtle" justifyContent="space-between" alignItems="center">
                    <OwnerTag name={plant.owner?.username ?? undefined} isBotanist={plant.owner?.is_botanist} />
                    <IconButton
                        icon={<Box as="i" display="inline-block" className="fa-regular fa-comment-dots" />}
                        variant="ghost"
                        color="text.brand"
                        onClick={comments.onOpen}
                        aria-label={t("plant.viewComments")}
                    />
                </CardFooter>
            </Card>
            <DrawerComment isOpen={comments.isOpen} onClose={comments.onClose} plantId={plant.id} />
            <CareLogDrawer plantId={plant.id} isOpen={journal.isOpen} canWrite={action === "sitting"} onClose={journal.onClose} />
            <MessagesDrawer
                offerId={chatOpen && myOffer ? myOffer.id : null}
                title={t("messages.title", { name: plant.owner?.username ?? "" })}
                canSend={myOffer?.status === "pending" || myOffer?.status === "accepted"}
                onClose={() => setChatOpen(false)}
            />
        </>
    );
};

export default CardFeed;
