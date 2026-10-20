import { Box, Button, Card, CardBody, Flex, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import EmptyState from "../component/generic/emptyState.tsx";
import { api, jsonBody } from "../api/client.ts";
import type { BotanistRequest } from "../api/types.ts";
import { useT } from "../i18n/index.ts";
import { useMeStore } from "../store/me.ts";

function AdminPage() {
    const me = useMeStore((state) => state.me);
    const [requests, setRequests] = useState<BotanistRequest[] | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const toast = useToast();
    const t = useT();

    useEffect(() => {
        if (me?.is_admin) api<BotanistRequest[]>("/admin/botanist-requests").then(setRequests).catch(() => setRequests([]));
    }, [me?.is_admin]);

    if (me && !me.is_admin) return <Navigate to="/myplants" replace />;

    const decide = async (userId: number, verified: boolean) => {
        setBusyId(userId);
        try {
            await api(`/admin/users/${userId}/botanist`, { method: "PUT", body: jsonBody({ verified }) });
            setRequests((current) => (current ?? []).filter((request) => request.id !== userId));
            toast({ title: verified ? t("admin.verified") : t("admin.rejected"), status: "success", duration: 2500, isClosable: true });
        } catch (error) {
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <>
            <Text color="text.muted" mb={6}>{t("admin.intro")}</Text>
            {requests !== null && requests.length === 0 ? (
                <EmptyState icon="fa-solid fa-user-check" title={t("admin.emptyTitle")} description={t("admin.emptyText")} />
            ) : (
                <VStack as="ul" listStyleType="none" spacing={3} align="stretch" maxW="2xl" aria-busy={requests === null}>
                    {(requests ?? []).map((request) => (
                        <Card as="li" key={request.id}>
                            <CardBody>
                                <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3}>
                                    <Box>
                                        <Text fontWeight="semibold">{request.username}</Text>
                                        <Text fontSize="sm" color="text.muted">{request.email}</Text>
                                    </Box>
                                    <Flex gap={2}>
                                        <Button size="sm" isLoading={busyId === request.id} onClick={() => decide(request.id, true)}>{t("admin.verify")}</Button>
                                        <Button size="sm" variant="outline" colorScheme="red" isDisabled={busyId === request.id} onClick={() => decide(request.id, false)}>{t("admin.reject")}</Button>
                                    </Flex>
                                </Flex>
                            </CardBody>
                        </Card>
                    ))}
                </VStack>
            )}
        </>
    );
}

export default AdminPage;
