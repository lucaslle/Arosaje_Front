import { API_URL } from "../api/apiUrl.ts";
import { Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CardFeed from "../component/generic/CardFeed.tsx";
import {useNavigate, useParams} from "react-router-dom";
import PlantGrid from "../component/generic/plantGrid.tsx";
import EmptyState from "../component/generic/emptyState.tsx";
import { TranslationKey, useT } from "../i18n/index.ts";

const DESCRIPTIONS: Record<string, TranslationKey> = {
    "all_plants": "sitting.allPlantsIntro",
    "care-requests": "sitting.requestsIntro",
};

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
}

function PlantsittingPage() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const toast = useToast();
    const { type } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const t = useT();
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPlants = async () => {
            setIsLoading(true);

            try {
                const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
                const [response, meResponse] = await Promise.all([
                    fetch(`${API_URL}/${type}/`, { headers }),
                    fetch(`${API_URL}/users/me/`, { headers }),
                ]);

                if (response.status === 401 || meResponse.status === 401) {
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

                if (!response.ok || !meResponse.ok) {
                    throw new Error(`Failed with status: ${response.ok ? meResponse.status : response.status}`);
                }

                const [data, me] = await Promise.all([response.json(), meResponse.json()]);
                setPlants(data);
                setCurrentUserId(me.id);
            } catch (error) {
                console.error("API Error:", error);
                toast({
                    title: t("sitting.loadError"),
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
    }, [toast, type]);

    return (
        <>
            <Text color="text.muted" mb={6}>{DESCRIPTIONS[type ?? ""] ? t(DESCRIPTIONS[type ?? ""]) : ""}</Text>
            {!isLoading && plants.length === 0 ? (
                <EmptyState
                    icon="fa-solid fa-hand-holding-heart"
                    title={t("sitting.emptyTitle")}
                    description={t("sitting.emptyText")}
                />
            ) : (
                <PlantGrid isLoading={isLoading}>
                    {plants.map((plant) => (
                        <CardFeed key={plant.id} plant={plant} currentUserId={currentUserId} />
                    ))}
                </PlantGrid>
            )}
        </>
    );
}

export default PlantsittingPage;