import { API_URL } from "../../api/apiUrl.ts";
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    Flex,
    Text,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    Heading,
    Badge,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Switch,
    useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import DrawerComment from "../specific/Comment/DrawerComment.tsx";
import { apiErrorMessage } from "../../api/apiError.ts";
import { useFormatDay, useT } from "../../i18n/index.ts";
import OffersDrawer from "../specific/care/offersDrawer.tsx";
import CareLogDrawer from "../specific/care/careLogDrawer.tsx";
import AdviceModal from "../specific/adviceModal.tsx";
import PlantPhoto from "./plantPhoto.tsx";
import OwnerTag from "./ownerTag.tsx";

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
    in_care: boolean;
    in_care_id: number | null;
    care_requested: boolean;
    care_start: string | null;
    care_end: string | null;
    owner?: Owner;
}

interface CardCurrentUserProps {
    plant: Plant;
    onUpdate: (updatedPlant: Plant) => void;
    onCareChanged: () => void;
}

const CardCurrentUser = ({ plant, onUpdate, onCareChanged }: CardCurrentUserProps) => {
    const toast = useToast();
    const t = useT();
    const { isOpen : updateIsOpen , onOpen : updateOnOpen, onClose : updateOnClose } = useDisclosure();
    const { isOpen : commentIsOpen , onOpen : commentOnOpen, onClose : commentOnClose } = useDisclosure();
    const offers = useDisclosure();
    const journal = useDisclosure();
    const advice = useDisclosure();
    const formatDay = useFormatDay();

    const [formData, setFormData] = useState({
        name: plant.name,
        location: plant.location,
        care_instructions: plant.care_instructions || "",
        care_requested: plant.care_requested,
        care_start: plant.care_start ?? "",
        care_end: plant.care_end ?? "",
        photo: null as File | null,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // start from the plant as it is now: the care state may have changed since the card was rendered
    const openEdit = () => {
        setFormData({
            name: plant.name,
            location: plant.location,
            care_instructions: plant.care_instructions || "",
            care_requested: plant.care_requested,
            care_start: plant.care_start ?? "",
            care_end: plant.care_end ?? "",
            photo: null,
        });
        setPhotoPreview(null);
        updateOnOpen();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            care_requested: e.target.checked
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                photo: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDelete = async () => {
        if (window.confirm(t("plant.confirmDelete", { name: plant.name }))) {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    toast({
                        title: t("common.error"),
                        description: t("common.mustBeLoggedIn"),
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                    return;
                }

                const response = await fetch(`${API_URL}/plants?plant_id=${plant.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(apiErrorMessage(errorData, t("plant.deleteError")));
                }

                toast({
                    title: t("plant.deleted", { name: plant.name }),
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                window.location.reload();
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : t("common.unknownError");

                toast({
                    title: t("plant.deleteError"),
                    description: errorMessage,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });

                console.error("Erreur lors de la suppression:", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast({
                    title: t("common.error"),
                    description: t("common.mustBeLoggedIn"),
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }


            if (formData.care_requested && (!formData.care_start || !formData.care_end)) {
                toast({ title: t("care.datesRequired"), status: "warning", duration: 4000, isClosable: true });
                return;
            }

            // the API reads text fields from the query string; only the photo travels in the body
            const queryParams = new URLSearchParams({
                name: formData.name,
                location: formData.location,
                care_instructions: formData.care_instructions,
                care_requested: String(formData.care_requested),
            });
            if (formData.care_requested) {
                queryParams.set("care_start", formData.care_start);
                queryParams.set("care_end", formData.care_end);
            }
            const formDataToSend = new FormData();
            if (formData.photo) {
                formDataToSend.append("photo", formData.photo);
            }

            const response = await fetch(`${API_URL}/plants/${plant.id}?${queryParams}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(apiErrorMessage(errorData, t("plant.updateError")));
            }

            const updatedPlant = await response.json();

            toast({
                title: t("plant.updated", { name: formData.name }),
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onUpdate(updatedPlant);
            updateOnClose();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t("common.unknownError");

            toast({
                title: t("plant.updateError"),
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            console.error("Erreur lors de la mise à jour:", error);
        }

    };

    return (
        <>
            <Card overflow="hidden" h="100%" transition="box-shadow 200ms ease, transform 200ms ease" _hover={{ boxShadow: "cardHover", transform: "translateY(-2px)" }}>
                <Box position="relative">
                    <PlantPhoto url={plant.photo_url} alt={plant.name} />
                    {(plant.in_care || plant.care_requested) && (
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
                    {(plant.care_requested || plant.in_care) && (
                        <Button size="sm" variant="outline" w="100%" mt={3} leftIcon={<Box as="i" className="fa-solid fa-hand-holding-heart" aria-hidden="true" />} onClick={offers.onOpen}>
                            {t("care.offersTitle")}
                        </Button>
                    )}
                </CardBody>
                <CardFooter px={4} py={3} borderTopWidth="1px" borderColor="border.subtle" justifyContent="space-between" alignItems="center">
                    <OwnerTag name={plant.owner?.username} isBotanist={plant.owner?.is_botanist} />
                    <Menu placement="bottom-end" isLazy>
                        <MenuButton
                            as={IconButton}
                            aria-label={t("plant.actionsFor", { name: plant.name })}
                            icon={<Box as="i" display="inline-block" className="fa-solid fa-ellipsis-vertical" />}
                            variant="ghost"
                            color="text.secondary"
                        />
                        <MenuList>
                            <MenuItem icon={<Box as="i" display="inline-block" className="fa-solid fa-pen" />} onClick={openEdit}>
                                {t("plant.edit")}
                            </MenuItem>
                            <MenuItem icon={<Box as="i" display="inline-block" className="fa-solid fa-hand-holding-heart" />} onClick={offers.onOpen}>
                                {t("care.offersTitle")}
                            </MenuItem>
                            <MenuItem icon={<Box as="i" display="inline-block" className="fa-solid fa-book-open" />} onClick={journal.onOpen}>
                                {t("journal.title")}
                            </MenuItem>
                            <MenuItem icon={<Box as="i" display="inline-block" className="fa-solid fa-user-doctor" />} onClick={advice.onOpen}>
                                {t("advice.ask")}
                            </MenuItem>
                            <MenuItem icon={<Box as="i" display="inline-block" className="fa-regular fa-comment-dots" />} onClick={commentOnOpen}>
                                {t("plant.comments")}
                            </MenuItem>
                            <MenuItem icon={<Box as="i" display="inline-block" className="fa-solid fa-trash" />} color="red.600" onClick={handleDelete}>
                                {t("plant.delete")}
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </CardFooter>
            </Card>

            {/* Edit Modal */}
            <Modal isOpen={updateIsOpen} onClose={updateOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontFamily="heading" fontWeight="normal">{t("plant.editTitle", { name: plant.name })}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <FormControl mb={4}>
                                <FormLabel>{t("plant.name")}</FormLabel>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t("plant.namePlaceholder")}
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>{t("plant.location")}</FormLabel>
                                <Input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder={t("plant.locationPlaceholder")}
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>{t("plant.careInstructions")}</FormLabel>
                                <Textarea
                                    name="care_instructions"
                                    value={formData.care_instructions}
                                    onChange={handleInputChange}
                                    placeholder={t("plant.careInstructions")}
                                />
                            </FormControl>

                            <FormControl mb={4} display="flex" alignItems="center">
                                <FormLabel htmlFor="care-requested" mb="0">
                                    {t("plant.requestCare")}
                                </FormLabel>
                                <Switch
                                    id="care-requested"
                                    isDisabled={plant.in_care}
                                    isChecked={formData.care_requested}
                                    onChange={handleSwitchChange}
                                />
                            </FormControl>

                            {formData.care_requested && (
                                <Flex gap={3} mb={4} direction={{ base: "column", sm: "row" }}>
                                    <FormControl isRequired>
                                        <FormLabel htmlFor={`care-start-${plant.id}`}>{t("care.startDate")}</FormLabel>
                                        <Input id={`care-start-${plant.id}`} type="date" name="care_start" min={new Date().toISOString().slice(0, 10)} value={formData.care_start} onChange={handleInputChange} />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel htmlFor={`care-end-${plant.id}`}>{t("care.endDate")}</FormLabel>
                                        <Input id={`care-end-${plant.id}`} type="date" name="care_end" min={formData.care_start || new Date().toISOString().slice(0, 10)} value={formData.care_end} onChange={handleInputChange} />
                                    </FormControl>
                                </Flex>
                            )}

                            <FormControl mb={4}>
                                <FormLabel>{t("plant.photo")}</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {photoPreview && (
                                    <Image
                                        src={photoPreview}
                                        alt="Preview"
                                        mt={2}
                                        maxH="200px"
                                        borderRadius="md"
                                    />
                                )}
                            </FormControl>

                            <Flex justify="flex-end" gap={3} mt={6}>
                                <Button variant="ghost" onClick={updateOnClose}>{t("common.cancel")}</Button>
                                <Button type="submit">{t("common.save")}</Button>
                            </Flex>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <DrawerComment isOpen={commentIsOpen} onClose={commentOnClose} plantId={plant.id} />
            <OffersDrawer plantId={plant.id} isOpen={offers.isOpen} onClose={offers.onClose} onCareChanged={onCareChanged} />
            <CareLogDrawer plantId={plant.id} isOpen={journal.isOpen} canWrite={false} onClose={journal.onClose} />
            <AdviceModal plantId={plant.id} isOpen={advice.isOpen} onClose={advice.onClose} />
        </>
    );
};

export default CardCurrentUser;