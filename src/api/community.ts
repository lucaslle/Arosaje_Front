import { useCallback, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { api } from "./client.ts";
import type { MyCareOffer, Plant } from "./types.ts";
import { useT } from "../i18n/index.ts";

// favourites and the offers I sent: what a plant card needs to know about the signed-in member
export const useCommunityState = () => {
    const [favorites, setFavorites] = useState<Plant[]>([]);
    const [favoritesLoaded, setFavoritesLoaded] = useState(false);
    const [myOffers, setMyOffers] = useState<MyCareOffer[]>([]);
    const toast = useToast();
    const t = useT();

    const reloadOffers = useCallback(async () => {
        setMyOffers(await api<MyCareOffer[]>("/care-offers/mine").catch(() => []));
    }, []);

    useEffect(() => {
        api<Plant[]>("/favorites/").then(setFavorites).catch(() => setFavorites([])).finally(() => setFavoritesLoaded(true));
        reloadOffers();
    }, [reloadOffers]);

    const toggleFavorite = useCallback(async (plant: Plant, favorite: boolean) => {
        setFavorites((current) => (favorite ? [plant, ...current] : current.filter((p) => p.id !== plant.id)));
        try {
            await api(`/plants/${plant.id}/favorite`, { method: favorite ? "PUT" : "DELETE" });
        } catch (error) {
            setFavorites((current) => (favorite ? current.filter((p) => p.id !== plant.id) : [plant, ...current]));
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        }
    }, [toast, t]);

    // the newest offer per plant is the one that matters
    const offerFor = useCallback((plantId: number) => myOffers.find((offer) => offer.plant_id === plantId), [myOffers]);

    return { favorites, favoritesLoaded, isFavorite: (plantId: number) => favorites.some((p) => p.id === plantId), toggleFavorite, offerFor, reloadOffers };
};
