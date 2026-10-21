import { api } from "../api/client.ts";
import type { Plant } from "../api/types.ts";
import { Box, Button, Grid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CardCurrentUser from "../component/generic/CardCurrentUser.tsx";
import { useEffect, useState } from "react";
import KPI from "../component/specific/StatOverlay/KPI.tsx";
import PlantGrid from "../component/generic/plantGrid.tsx";
import EmptyState from "../component/generic/emptyState.tsx";
import AddModal from "../component/specific/addModal.tsx";
import { useT } from "../i18n/index.ts";

const HomePage = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = useT();

    useEffect(() => {
        api<Plant[]>("/my_plants/")
            .then(setPlants)
            .catch((error) => toast({ title: t("home.loadError"), description: (error as Error).message, status: "error", duration: 3000, isClosable: true }))
            .finally(() => setIsLoading(false));
    }, [toast, t, reloadKey]);

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
                                onRefresh={() => setReloadKey((key) => key + 1)}
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