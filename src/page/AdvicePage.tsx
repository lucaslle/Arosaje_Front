import { Box, Button, Card, CardBody, Flex, Heading, SimpleGrid, Skeleton, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import EmptyState from "../component/generic/emptyState.tsx";
import OwnerTag from "../component/generic/ownerTag.tsx";
import PlantPhoto from "../component/generic/plantPhoto.tsx";
import DrawerComment from "../component/specific/Comment/DrawerComment.tsx";
import { api } from "../api/client.ts";
import type { AdviceRequest } from "../api/types.ts";
import { useLocale, useT } from "../i18n/index.ts";
import { isVerifiedBotanist, useMeStore } from "../store/me.ts";

function AdvicePage() {
    const me = useMeStore((state) => state.me);
    const [requests, setRequests] = useState<AdviceRequest[] | null>(null);
    const [answering, setAnswering] = useState<number | null>(null);
    const [skeletonStart, skeletonEnd] = useColorModeValue(["brand.50", "brand.100"], ["whiteAlpha.100", "whiteAlpha.200"]);
    const t = useT();
    const locale = useLocale();
    const allowed = isVerifiedBotanist(me);

    const load = () => api<AdviceRequest[]>("/advice-requests/").then(setRequests).catch(() => setRequests([]));

    useEffect(() => {
        if (allowed) load();
    }, [allowed]);

    if (me && !allowed) return <Navigate to="/myplants" replace />;

    return (
        <>
            <Text color="text.muted" mb={6}>{t("advice.pageIntro")}</Text>
            {requests === null ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {[0, 1].map((i) => <Skeleton key={i} h="220px" borderRadius="card" startColor={skeletonStart} endColor={skeletonEnd} />)}
                </SimpleGrid>
            ) : requests.length === 0 ? (
                <EmptyState icon="fa-solid fa-user-doctor" title={t("advice.emptyTitle")} description={t("advice.emptyText")} />
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {requests.map((request) => (
                        <Card key={request.id} overflow="hidden" direction={{ base: "column", sm: "row" }}>
                            <Box w={{ base: "100%", sm: "40%" }} flexShrink={0}>
                                <PlantPhoto url={request.plant.photo_url ?? ""} alt={request.plant.name} />
                            </Box>
                            <CardBody display="flex" flexDirection="column" gap={2}>
                                <Heading as="h3" size="sm">{request.plant.name}</Heading>
                                <OwnerTag name={request.plant.owner.username ?? undefined} />
                                <Text fontSize="xs" color="text.muted">
                                    {t("advice.askedBy", { name: request.plant.owner.username ?? "" })} · {new Date(request.created_at + "Z").toLocaleDateString(locale)}
                                </Text>
                                <Text fontStyle="italic" color="text.secondary">« {request.question} »</Text>
                                <Flex mt="auto" pt={2}>
                                    <Button size="sm" leftIcon={<Box as="i" className="fa-regular fa-comment-dots" aria-hidden="true" />} onClick={() => setAnswering(request.plant_id)}>
                                        {t("advice.answer")}
                                    </Button>
                                </Flex>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
            <DrawerComment
                isOpen={answering !== null}
                onClose={() => {
                    setAnswering(null);
                    load();
                }}
                plantId={answering ?? 0}
            />
        </>
    );
}

export default AdvicePage;
