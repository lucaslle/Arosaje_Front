import { Box, Avatar, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useT } from "../../i18n/index.ts";

const OwnerTag = ({ name, isBotanist }: { name?: string; isBotanist?: boolean }) => {
    const t = useT();
    return (
    <Flex align="center" gap={2} minW={0}>
        <Avatar name={name} size="sm" bg="bg.muted" color="text.brand" />
        <Text fontWeight="semibold" fontSize="sm" color="text.primary" noOfLines={1}>{name}</Text>
        {isBotanist && (
            <Tooltip label={t("common.botanist")} hasArrow>
                <Box as="i" display="inline-block" className="fa-solid fa-circle-check" color="text.brand" role="img" aria-label={t("common.botanist")} tabIndex={0} />
            </Tooltip>
        )}
    </Flex>
    );
};

export default OwnerTag;
