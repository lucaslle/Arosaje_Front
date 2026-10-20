import { SimpleGrid, Skeleton, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

const DEFAULT_COLUMNS = { base: 1, sm: 2, lg: 3, xl: 4 };

interface PlantGridProps {
    isLoading: boolean;
    columns?: Record<string, number>;
    children: ReactNode;
}

const PlantGrid = ({ isLoading, columns = DEFAULT_COLUMNS, children }: PlantGridProps) => {
    // Skeleton resolves plain palette colors only, not semantic tokens
    const [startColor, endColor] = useColorModeValue(["brand.50", "brand.100"], ["whiteAlpha.100", "whiteAlpha.200"]);
    return (
    <SimpleGrid columns={columns} spacing={6} aria-busy={isLoading}>
        {isLoading
            ? [...Array(6)].map((_, index) => <Skeleton key={index} h="300px" borderRadius="card" startColor={startColor} endColor={endColor} />)
            : children}
    </SimpleGrid>
    );
};

export default PlantGrid;
