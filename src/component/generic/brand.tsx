import { Box, Flex, Text } from "@chakra-ui/react";

const Brand = ({ color = "text.brand" }: { color?: string }) => (
    <Flex align="center" gap={3} color={color}>
        <Box as="i" display="inline-block" className="fa-solid fa-seedling" aria-hidden="true" fontSize="2xl" />
        <Text fontFamily="heading" fontSize="2xl" letterSpacing="wide">A'rosa-je</Text>
    </Flex>
);

export default Brand;
