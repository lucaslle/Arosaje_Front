import { API_URL } from "../api/apiUrl.ts";
import { Box, Button, Grid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CardCurrentUser from "../component/generic/CardCurrentUser.tsx";
import { useEffect, useState } from "react";
import KPI from "../component/specific/StatOverlay/KPI.tsx";
import {useNavigate} from "react-router-dom";
import PlantGrid from "../component/generic/plantGrid.tsx";
import EmptyState from "../component/generic/emptyState.tsx";
import AddModal from "../component/specific/addModal.tsx";
import { useT } from "../i18n/index.ts";

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
}

const HomePage = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const toast = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = useT();

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const response = await fetch(`${API_URL}/my_plants/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.status === 401) {
                    toast({
                        title: t("common.sessionExpired"),
                        description: t("common.pleaseLogInAgain"),
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                    });
                    navigate("/login");
                    return;
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch plants');
                }

                const data = await response.json();
                setPlants(data);


            } catch (error) {
                toast({
                    title: t("home.loadError"),
                    description: error instanceof Error ? error.message : t("common.unknownError"),
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlants();
    }, [toast]);

    return (
        <Grid templateColumns={{ base: "1fr", xl: "1fr 280px" }} gap={8} alignItems="start">
            <Box>
                <Text color="text.muted" mb={6}>{t("home.intro")}</Text>
                {!isLoading && plants.length === 0 ? (
                    <EmptyState
                        icon="fa-solid fa-seedling"
                        title={t("home.emptyTitle")}
                        description={t("home.emptyText")}
                        action={<Button leftIcon={<AddIcon boxSize={3} />} onClick={onOpen} mt={2}>{t("header.addPlant")}</Button>}
                    />
                ) : (
                    <PlantGrid isLoading={isLoading} columns={{ base: 1, sm: 2, lg: 3 }}>
                        {plants.map((plant) => (
                            <CardCurrentUser
                                key={plant.id}
                                plant={plant}
                                onUpdate={(updated) => setPlants((current) => current.map((p) => (p.id === updated.id ? updated : p)))}
                            />
                        ))}
                    </PlantGrid>
                )}
            </Box>
            <KPI plantsInCare={plants.filter((plant) => plant.in_care).length} total={plants.length} />
            <AddModal isOpen={isOpen} onClose={onClose} />
        </Grid>
    );
};

export default HomePage;