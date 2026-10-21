import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardFeed from "../component/generic/CardFeed.tsx";
import PlantGrid from "../component/generic/plantGrid.tsx";
import EmptyState from "../component/generic/emptyState.tsx";
import { ApiError, api } from "../api/client.ts";
import { useCommunityState } from "../api/community.ts";
import type { Plant } from "../api/types.ts";
import { TranslationKey, useT } from "../i18n/index.ts";
import { useMeStore } from "../store/me.ts";

const PAGE_SIZE = 24;

const DESCRIPTIONS: Record<string, TranslationKey> = {
    "all_plants": "sitting.allPlantsIntro",
    "care-requests": "sitting.requestsIntro",
};

function PlantsittingPage() {
    const { type } = useParams();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const meId = useMeStore((state) => state.me?.id ?? null);
    const community = useCommunityState();
    const toast = useToast();
    const t = useT();

    // wait for the member to stop typing before searching
    useEffect(() => {
        const timer = setTimeout(() => setQuery(search.trim()), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchPage = async (offset: number) => {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
        if (query) params.set("q", query);
        return api<Plant[]>(`/${type}/?${params}`);
    };

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        fetchPage(0)
            .then((page) => {
                if (cancelled) return;
                setPlants(page);
                setHasMore(page.length === PAGE_SIZE);
            })
            .catch((error) => {
                if (cancelled) return;
                if (error instanceof ApiError && error.status === 401) return; // the layout signs out and redirects
                toast({ title: t("sitting.loadError"), description: (error as Error).message, status: "error", duration: 3000, isClosable: true });
            })
            .finally(() => !cancelled && setIsLoading(false));
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, query]);

    const loadMore = async () => {
        setIsLoadingMore(true);
        try {
            const page = await fetchPage(plants.length);
            setPlants((current) => [...current, ...page]);
            setHasMore(page.length === PAGE_SIZE);
        } catch (error) {
            toast({ title: t("sitting.loadError"), description: (error as Error).message, status: "error", duration: 3000, isClosable: true });
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <>
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ md: "center" }} gap={4} mb={6}>
                <Text color="text.muted">{DESCRIPTIONS[type ?? ""] ? t(DESCRIPTIONS[type ?? ""]) : ""}</Text>
                <InputGroup maxW={{ md: "sm" }}>
                    <InputLeftElement pointerEvents="none" color="text.muted">
                        <Box as="i" className="fa-solid fa-magnifying-glass" aria-hidden="true" />
                    </InputLeftElement>
                    <Input type="search" aria-label={t("search.label")} placeholder={t("search.placeholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
                </InputGroup>
            </Flex>
            {!isLoading && plants.length === 0 ? (
                <EmptyState
                    icon={query ? "fa-solid fa-magnifying-glass" : "fa-solid fa-hand-holding-heart"}
                    title={query ? t("list.noResults") : t("sitting.emptyTitle")}
                    description={query ? "" : t("sitting.emptyText")}
                />
            ) : (
                <>
                    <PlantGrid isLoading={isLoading}>
                        {plants.map((plant) => (
                            <CardFeed
                                key={plant.id}
                                plant={plant}
                                meId={meId}
                                myOffer={community.offerFor(plant.id)}
                                isFavorite={community.isFavorite(plant.id)}
                                onToggleFavorite={(_, favorite) => community.toggleFavorite(plant, favorite)}
                                onOffersChanged={community.reloadOffers}
                            />
                        ))}
                    </PlantGrid>
                    {hasMore && !isLoading && (
                        <Flex justify="center" mt={8}>
                            <Button variant="outline" isLoading={isLoadingMore} onClick={loadMore}>{t("list.loadMore")}</Button>
                        </Flex>
                    )}
                </>
            )}
        </>
    );
}

export default PlantsittingPage;
