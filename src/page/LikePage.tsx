import EmptyState from "../component/generic/emptyState.tsx";
import { useT } from "../i18n/index.ts";

// shortcut: no favourites API yet, the old page rendered CardFeed without a plant and crashed; wire it when the back exposes likes
function LikePage() {
    const t = useT();
    return (
        <EmptyState
            icon="fa-regular fa-heart"
            title={t("favourites.emptyTitle")}
            description={t("favourites.emptyText")}
        />
    );
}

export default LikePage;
