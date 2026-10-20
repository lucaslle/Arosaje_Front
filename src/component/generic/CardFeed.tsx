import { API_URL } from "../../api/apiUrl.ts";
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    Flex,
    Text,
    IconButton,
    useDisclosure,
    Heading,
    useToast
} from "@chakra-ui/react";
import { useState } from "react";
import DrawerComment from "../specific/Comment/DrawerComment.tsx";
import PlantPhoto from "./plantPhoto.tsx";
import OwnerTag from "./ownerTag.tsx";
import { useT } from "../../i18n/index.ts";

interface Owner {
    email: string;
    phone: string;
    username: string;
    id: number;
    is_active: boolean;
    is_botanist: boolean;
}

interface Plant {
    name: string;
    location: string;
    care_instructions: string;
    id: number;
    photo_url: string;
    owner_id: number;
    created_at: string;
    in_care_id: number | null;
    care_requested: boolean;
    owner?: Owner;
}

interface PlantProps {
    plant: Plant;
    currentUserId: number | null;
}

export const careState = (caretakerId: number | null, currentUserId: number | null, careRequested: boolean) => {
    const isCare = currentUserId !== null && caretakerId === currentUserId;
    const isCaredByOther = caretakerId !== null && !isCare;
    // the API only lets a member take a plant whose owner asked for a sitter
    return { isCare, isCaredByOther, canTake: currentUserId !== null && caretakerId === null && careRequested };
};

const CardFeed = ({ plant, currentUserId }: PlantProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // in_care_id is the user currently looking after the plant
    const [caretakerId, setCaretakerId] = useState(plant.in_care_id);
    const [careRequested, setCareRequested] = useState(plant.care_requested);
    const [isUpdating, setIsUpdating] = useState(false);
    const toast = useToast();
    const t = useT();
    const { isCare, isCaredByOther, canTake } = careState(caretakerId, currentUserId, careRequested);

    const unavailableLabel = isCaredByOther ? t("plant.caredByOther") : t("plant.careNotRequested");

    const handleHeartClick = async () => {
        const endpoint = isCare
            ? `${API_URL}/plants/${plant.id}/end-care`
            : `${API_URL}/plants/${plant.id}/start-care`;

        setIsUpdating(true);
        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour des soins");
            }
            setCaretakerId(isCare ? null : currentUserId);
            setCareRequested(false);
            toast({
                title: isCare ? t("plant.careStopped") : t("plant.careStarted"),
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: t("common.error"),
                description: t("plant.careError"),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <Card overflow="hidden" h="100%" transition="box-shadow 200ms ease, transform 200ms ease" _hover={{ boxShadow: "cardHover", transform: "translateY(-2px)" }}>
                <Box position="relative">
                    <PlantPhoto url={plant.photo_url} alt={plant.name} />
                    <IconButton
                        icon={<Box as="i" display="inline-block" className={`fa-${isCare ? "solid" : "regular"} fa-heart`} color={isCare ? "red.500" : "gray.700"} />}
                        position="absolute"
                        top={3}
                        right={3}
                        isRound
                        bg="whiteAlpha.900"
                        _hover={{ bg: "white" }}
                        _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                        boxShadow="sm"
                        aria-label={isCare ? t("plant.stopCare") : canTake ? t("plant.startCare") : unavailableLabel}
                        title={isCare || canTake ? undefined : unavailableLabel}
                        aria-pressed={isCare}
                        isDisabled={!isCare && !canTake}
                        isLoading={isUpdating}
                        onClick={handleHeartClick}
                    />
                </Box>
                <CardBody px={4} py={3}>
                    <Heading as="h3" size="sm" noOfLines={1} mb={1}>{plant.name}</Heading>
                    <Flex align="center" gap={2} fontSize="sm" color="text.muted">
                        <Box as="i" display="inline-block" className="fa-solid fa-location-dot" aria-hidden="true" />
                        <Text noOfLines={1}>{plant.location}</Text>
                    </Flex>
                </CardBody>
                <CardFooter px={4} py={3} borderTopWidth="1px" borderColor="border.subtle" justifyContent="space-between" alignItems="center">
                    <OwnerTag name={plant.owner?.username} isBotanist={plant.owner?.is_botanist} />
                    <IconButton
                        icon={<Box as="i" display="inline-block" className="fa-regular fa-comment-dots" />}
                        variant="ghost"
                        color="text.brand"
                        onClick={onOpen}
                        aria-label={t("plant.viewComments")}
                    />
                </CardFooter>
            </Card>
            <DrawerComment isOpen={isOpen} onClose={onClose} plantId={plant.id} />
        </>
    );
};

export default CardFeed;
