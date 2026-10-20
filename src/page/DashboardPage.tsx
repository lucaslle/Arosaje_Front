import {
    Badge, Box, Button, Flex, Grid, Heading, Image, SimpleGrid, Skeleton, Text, VStack, useColorModeValue, useToast,
} from "@chakra-ui/react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api/client.ts";
import { API_URL } from "../api/apiUrl.ts";
import type { Dashboard } from "../api/types.ts";
import DrawerComment from "../component/specific/Comment/DrawerComment.tsx";
import CareLogDrawer from "../component/specific/care/careLogDrawer.tsx";
import OffersDrawer from "../component/specific/care/offersDrawer.tsx";
import { TranslationKey, useFormatDay, useT } from "../i18n/index.ts";
import { useMeStore } from "../store/me.ts";

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
    <Box as="section" bg="bg.surface" borderWidth="1px" borderColor="border.subtle" borderRadius="card" boxShadow="card" p={{ base: 5, md: 6 }}>
        <Heading as="h2" size="sm" mb={4}>{title}</Heading>
        {children}
    </Box>
);

// stat tile: sentence-case label, plain-ink value; the icon carries the identity, not the number's color
const StatTile = ({ label, value, icon, to }: { label: string; value: number; icon: string; to: string }) => (
    <Box
        as={RouterLink}
        to={to}
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius="card"
        boxShadow="card"
        p={5}
        transition="box-shadow 200ms ease, transform 200ms ease"
        _hover={{ boxShadow: "cardHover", transform: "translateY(-2px)" }}
        _focusVisible={{ boxShadow: "outline" }}
    >
        <Flex align="center" justify="space-between" mb={3}>
            <Text fontSize="sm" color="text.muted">{label}</Text>
            <Flex align="center" justify="center" w={9} h={9} borderRadius="full" bg="bg.subtle" color="text.brand">
                <Box as="i" className={icon} aria-hidden="true" />
            </Flex>
        </Flex>
        <Text fontSize="3xl" fontWeight="semibold" lineHeight="1" color="text.primary">{value}</Text>
    </Box>
);

const EmptyLine = ({ children }: { children: ReactNode }) => <Text color="text.muted" fontSize="sm">{children}</Text>;

function DashboardPage() {
    const [data, setData] = useState<Dashboard | null>(null);
    const [offersPlant, setOffersPlant] = useState<number | null>(null);
    const [journalPlant, setJournalPlant] = useState<number | null>(null);
    const [commentsPlant, setCommentsPlant] = useState<number | null>(null);
    const me = useMeStore((state) => state.me);
    const [skeletonStart, skeletonEnd] = useColorModeValue(["brand.50", "brand.100"], ["whiteAlpha.100", "whiteAlpha.200"]);
    const toast = useToast();
    const t = useT();
    const formatDay = useFormatDay();

    const load = useCallback(() => {
        api<Dashboard>("/users/me/dashboard")
            .then(setData)
            .catch((error) => toast({ title: t("dashboard.loadError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true }));
    }, [toast, t]);

    useEffect(() => {
        load();
    }, [load]);

    if (!data) {
        return (
            <VStack align="stretch" spacing={6} aria-busy="true">
                <Skeleton h="40px" w="60%" borderRadius="lg" startColor={skeletonStart} endColor={skeletonEnd} />
                <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
                    {[0, 1, 2, 3].map((i) => <Skeleton key={i} h="112px" borderRadius="card" startColor={skeletonStart} endColor={skeletonEnd} />)}
                </SimpleGrid>
                <Skeleton h="240px" borderRadius="card" startColor={skeletonStart} endColor={skeletonEnd} />
            </VStack>
        );
    }

    const todos = [
        ...data.offers_to_answer.map((offer) => ({ key: `o${offer.id}`, icon: "fa-solid fa-hand-holding-heart", text: t("dashboard.offerTodo", { name: offer.sitter_username ?? "", plant: offer.plant_name }), action: t("dashboard.see"), plantId: offer.plant_id })),
        ...data.reviews_to_give.map((offer) => ({ key: `r${offer.id}`, icon: "fa-solid fa-star", text: t("dashboard.reviewTodo", { name: offer.sitter_username ?? "", plant: offer.plant_name }), action: t("review.title"), plantId: offer.plant_id })),
    ];
    const reputation = data.reputation;

    return (
        <>
            <Box mb={6}>
                <Heading as="h2" size="lg" mb={1}>{t("dashboard.hello", { name: me?.username ?? "" })}</Heading>
                <Text color="text.muted">{t("dashboard.intro")}</Text>
            </Box>

            <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4} mb={8}>
                <StatTile label={t("dashboard.statPlants")} value={data.plants_total} icon="fa-solid fa-seedling" to="/myplants" />
                <StatTile label={t("dashboard.statWaiting")} value={data.plants_waiting_sitter} icon="fa-regular fa-clock" to="/myplants" />
                <StatTile label={t("dashboard.statCared")} value={data.plants_being_cared} icon="fa-solid fa-shield-heart" to="/myplants" />
                <StatTile label={t("dashboard.statSitting")} value={data.sitting.length} icon="fa-solid fa-hand-holding-heart" to="/care-requests" />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6} alignItems="start">
                <VStack spacing={6} align="stretch">
                    <Panel title={t("dashboard.todo")}>
                        {todos.length === 0 ? (
                            <EmptyLine>{t("dashboard.todoEmpty")}</EmptyLine>
                        ) : (
                            <VStack as="ul" listStyleType="none" spacing={2} align="stretch">
                                {todos.map((todo) => (
                                    <Flex as="li" key={todo.key} align="center" gap={3} p={3} borderRadius="xl" bg="bg.subtle">
                                        <Box as="i" className={todo.icon} color="text.brand" w={5} textAlign="center" aria-hidden="true" />
                                        <Text flex={1} fontSize="sm">{todo.text}</Text>
                                        <Button size="sm" variant="outline" onClick={() => setOffersPlant(todo.plantId)}>{todo.action}</Button>
                                    </Flex>
                                ))}
                            </VStack>
                        )}
                    </Panel>

                    <Panel title={t("dashboard.questions")}>
                        {data.advice.length === 0 ? (
                            <EmptyLine>{t("dashboard.questionsEmpty")}</EmptyLine>
                        ) : (
                            <VStack as="ul" listStyleType="none" spacing={2} align="stretch">
                                {data.advice.map((advice) => (
                                    <Flex as="li" key={advice.id} align="center" gap={3} p={3} borderRadius="xl" bg="bg.subtle">
                                        <Box flex={1} minW={0}>
                                            <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>{advice.plant_name}</Text>
                                            <Text fontSize="sm" color="text.muted" noOfLines={1}>{advice.question}</Text>
                                        </Box>
                                        <Badge colorScheme={advice.status === "answered" ? "green" : "orange"} borderRadius="full" px={2} textTransform="none">
                                            {t((advice.status === "answered" ? "dashboard.adviceAnswered" : "dashboard.adviceOpen") as TranslationKey)}
                                        </Badge>
                                        <Button size="sm" variant="ghost" onClick={() => setCommentsPlant(advice.plant_id)}>{t("dashboard.see")}</Button>
                                    </Flex>
                                ))}
                            </VStack>
                        )}
                    </Panel>
                </VStack>

                <VStack spacing={6} align="stretch">
                    <Panel title={t("dashboard.sitting")}>
                        {data.sitting.length === 0 ? (
                            <EmptyLine>{t("dashboard.sittingEmpty")}</EmptyLine>
                        ) : (
                            <VStack as="ul" listStyleType="none" spacing={2} align="stretch">
                                {data.sitting.map(({ plant, care_end }) => (
                                    <Flex as="li" key={plant.id} align="center" gap={3} p={2} borderRadius="xl" bg="bg.subtle">
                                        <Image src={plant.photo_url ? `${API_URL}/${plant.photo_url}` : undefined} alt="" w={12} h={12} borderRadius="lg" objectFit="cover" bg="bg.muted" fallback={<Box w={12} h={12} borderRadius="lg" bg="bg.muted" />} />
                                        <Box flex={1} minW={0}>
                                            <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>{plant.name}</Text>
                                            {care_end && <Text fontSize="xs" color="text.muted">{t("dashboard.until", { date: formatDay(care_end) })}</Text>}
                                        </Box>
                                        <Button size="sm" variant="ghost" onClick={() => setJournalPlant(plant.id)}>{t("journal.title")}</Button>
                                    </Flex>
                                ))}
                            </VStack>
                        )}
                        {data.my_pending_offers > 0 && (
                            <Text fontSize="sm" color="text.muted" mt={3}>{t("dashboard.pendingOffers", { count: data.my_pending_offers })}</Text>
                        )}
                        <Button as={RouterLink} to="/care-requests" size="sm" variant="link" color="text.brand" mt={4}>
                            {t("dashboard.findPlants")}
                        </Button>
                    </Panel>

                    <Panel title={t("dashboard.reputation")}>
                        {reputation.rating_average === null ? (
                            <EmptyLine>{t("dashboard.reputationEmpty")}</EmptyLine>
                        ) : (
                            <Flex align="baseline" gap={2} mb={2}>
                                <Box as="i" className="fa-solid fa-star" color="accent.500" aria-hidden="true" />
                                <Text fontSize="3xl" fontWeight="semibold" lineHeight="1">{reputation.rating_average}</Text>
                                <Text color="text.muted">/ 5</Text>
                            </Flex>
                        )}
                        <Text fontSize="sm" color="text.muted">
                            {t("dashboard.reviews", { count: reputation.rating_count })} · {t("dashboard.cares", { count: reputation.completed_cares })}
                        </Text>
                    </Panel>
                </VStack>
            </Grid>

            {offersPlant !== null && (
                <OffersDrawer plantId={offersPlant} isOpen onClose={() => { setOffersPlant(null); load(); }} onCareChanged={load} />
            )}
            {journalPlant !== null && (
                <CareLogDrawer plantId={journalPlant} isOpen canWrite onClose={() => setJournalPlant(null)} />
            )}
            <DrawerComment isOpen={commentsPlant !== null} onClose={() => setCommentsPlant(null)} plantId={commentsPlant ?? 0} />
        </>
    );
}

export default DashboardPage;
