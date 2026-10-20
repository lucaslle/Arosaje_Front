import { Box, CircularProgress, CircularProgressLabel, Flex, Heading, Stat, StatHelpText, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";
import { useT } from "../../../i18n/index.ts";

interface KPIProps {
    plantsInCare: number;
    total: number;
}

function KPI({ plantsInCare, total }: KPIProps) {
    const percent = total === 0 ? 0 : Math.round((plantsInCare / total) * 100);
    const t = useT();
    const trackColor = useColorModeValue("brand.50", "whiteAlpha.200");

    return (
        <Box as="aside" bg="bg.surface" borderWidth="1px" borderColor="border.subtle" borderRadius="card" boxShadow="card" p={6} position={{ xl: "sticky" }} top={{ xl: 24 }}>
            <Heading as="h2" size="sm" mb={6}>{t("kpi.title")}</Heading>
            <Flex direction="column" align="center" gap={6}>
                <CircularProgress value={percent} size="140px" thickness="10px" color="brand.600" trackColor={trackColor} aria-label={t("kpi.progressLabel")}>
                    <CircularProgressLabel fontSize="xl" fontWeight="bold" color="text.primary">
                        {plantsInCare}/{total}
                    </CircularProgressLabel>
                </CircularProgress>
                <Stat textAlign="center">
                    <StatLabel color="text.muted">{t("kpi.inCare")}</StatLabel>
                    <StatNumber color="text.brand">{percent} %</StatNumber>
                    <StatHelpText color="text.muted" mb={0}>{t("kpi.help")}</StatHelpText>
                </Stat>
            </Flex>
        </Box>
    );
}

export default KPI;
