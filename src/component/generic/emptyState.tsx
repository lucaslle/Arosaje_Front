import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
    <Flex direction="column" align="center" textAlign="center" bg="bg.surface" borderWidth="1px" borderColor="border.subtle" borderRadius="card" boxShadow="card" px={6} py={14} gap={3}>
        <Flex align="center" justify="center" w={16} h={16} borderRadius="full" bg="bg.subtle" color="text.brand">
            <Box as="i" display="inline-block" className={icon} fontSize="2xl" aria-hidden="true" />
        </Flex>
        <Heading as="h2" size="md">{title}</Heading>
        <Text color="text.muted" maxW="sm">{description}</Text>
        {action}
    </Flex>
);

export default EmptyState;
