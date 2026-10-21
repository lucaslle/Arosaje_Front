import React, { useRef, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Input,
    Textarea,
    VStack,
    Image,
    Flex,
    useToast
} from "@chakra-ui/react";
import GenericModal from "../generic/genericModal.tsx";
import { api } from "../../api/client.ts";
import { useT } from "../../i18n/index.ts";

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddModal = ({ isOpen, onClose }: AddModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const t = useT();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        care_instructions: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // only one photo is sent, so only one preview is shown
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAdd = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        try {
            // form fields, not the URL: the location is personal and URLs end up in the server logs
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('location', formData.location);
            if (formData.care_instructions) submitData.append('care_instructions', formData.care_instructions);
            if (selectedFile) {
                submitData.append('photo', selectedFile);
            }

            await api('/plants/', { method: 'POST', body: submitData });

            toast({
                title: t('add.success'),
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            window.location.reload();
            onClose();
        } catch (error) {
            toast({
                title: t("add.error"),
                description: error instanceof Error ? error.message : t("common.unknownError"),
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("add.title")}
            size="lg"
            onConfirm={handleSubmit}
            confirmLabel={t("add.confirm")}
            isConfirmDisabled={!selectedFile || !formData.name.trim() || !formData.location.trim()}
        >
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>{t("plant.name")}</FormLabel>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t("add.namePlaceholder")}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>{t("plant.careInstructions")}</FormLabel>
                    <Textarea
                        name="care_instructions"
                        value={formData.care_instructions}
                        onChange={handleInputChange}
                        placeholder={t("add.carePlaceholder")}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>{t("add.location")}</FormLabel>
                    <HStack>
                        <Input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder={t("add.locationPlaceholder")}
                        />
                        <IconButton
                            aria-label={t("add.searchLocation")}
                            variant="outline"
                            icon={<i className="fa-solid fa-location-dot" aria-hidden="true"></i>}
                        />
                    </HStack>
                </FormControl>

                <Flex gap={4}>
                    <Button
                        leftIcon={<i className="fa-solid fa-camera" aria-hidden="true"></i>}
                        variant="outline"
                        onClick={handleAdd}
                    >
                        {selectedFile ? t("add.changePhoto") : t("add.addPhoto")}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </Flex>

                {previewUrl && (
                    <Box borderWidth="1px" borderRadius="xl" borderColor="border.subtle" overflow="hidden" w="160px" h="120px">
                        <Image src={previewUrl} alt={t("add.photoPreview")} objectFit="cover" w="100%" h="100%" />
                    </Box>
                )}
            </VStack>
        </GenericModal>
    );
};

export default AddModal;