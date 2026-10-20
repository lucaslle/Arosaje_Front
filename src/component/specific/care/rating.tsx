import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import type { SitterPublic } from "../../../api/types.ts";
import { useT } from "../../../i18n/index.ts";

const Star = ({ filled }: { filled: boolean }) => (
    <Box as="i" className={`fa-${filled ? "solid" : "regular"} fa-star`} color={filled ? "accent.500" : "text.muted"} aria-hidden="true" />
);

export const SitterRating = ({ sitter }: { sitter: SitterPublic }) => {
    const t = useT();
    return (
        <Flex align="center" gap={2} fontSize="sm" color="text.muted">
            {sitter.rating_average !== null && <Star filled />}
            <Text>
                {sitter.rating_average !== null
                    ? t("care.ratingSummary", { average: sitter.rating_average, count: sitter.rating_count, completed: sitter.completed_cares })
                    : t("care.noRating", { completed: sitter.completed_cares })}
            </Text>
        </Flex>
    );
};

export const StarInput = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
    const t = useT();
    return (
        <Flex role="radiogroup" aria-label={t("review.title")} gap={1}>
            {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                    key={star}
                    role="radio"
                    aria-checked={value === star}
                    aria-label={t("review.stars", { count: star })}
                    variant="ghost"
                    icon={<Star filled={star <= value} />}
                    onClick={() => onChange(star)}
                />
            ))}
        </Flex>
    );
};
