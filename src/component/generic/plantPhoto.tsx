import { API_URL } from "../../api/apiUrl.ts";
import { Box, AspectRatio, Flex, Image } from "@chakra-ui/react";

const PlantPhoto = ({ url, alt }: { url: string; alt: string }) => (
    <AspectRatio ratio={4 / 3} bg="bg.subtle">
        <Image
            src={url ? `${API_URL}/${url}` : undefined}
            alt={alt}
            objectFit="cover"
            loading="lazy"
            fallback={
                <Flex align="center" justify="center" bg="bg.subtle" color="icon.placeholder">
                    <Box as="i" display="inline-block" className="fa-solid fa-seedling" fontSize="4xl" aria-hidden="true" />
                </Flex>
            }
        />
    </AspectRatio>
);

export default PlantPhoto;
