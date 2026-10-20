import CardFeed from "../component/generic/CardFeed.tsx";
import EmptyState from "../component/generic/emptyState.tsx";
import PlantGrid from "../component/generic/plantGrid.tsx";
import { useCommunityState } from "../api/community.ts";
import { useT } from "../i18n/index.ts";
import { useMeStore } from "../store/me.ts";

function LikePage() {
    const t = useT();
    const meId = useMeStore((state) => state.me?.id ?? null);
    const community = useCommunityState();

    if (community.favoritesLoaded && community.favorites.length === 0) {
        return <EmptyState icon="fa-regular fa-heart" title={t("favourites.emptyTitle")} description={t("favourites.emptyText")} />;
    }

    return (
        <PlantGrid isLoading={!community.favoritesLoaded}>
            {community.favorites.map((plant) => (
                <CardFeed
                    key={plant.id}
                    plant={plant}
                    meId={meId}
                    myOffer={community.offerFor(plant.id)}
                    isFavorite
                    onToggleFavorite={(_, favorite) => community.toggleFavorite(plant, favorite)}
                    onOffersChanged={community.reloadOffers}
                />
            ))}
        </PlantGrid>
    );
}

export default LikePage;
