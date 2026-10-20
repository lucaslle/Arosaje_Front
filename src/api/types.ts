export interface PublicUser {
    id: number;
    username: string | null;
    is_botanist: boolean;
}

export interface SitterPublic extends PublicUser {
    rating_average: number | null;
    rating_count: number;
    completed_cares: number;
}

export interface Plant {
    id: number;
    name: string;
    location: string;
    care_instructions: string | null;
    photo_url: string | null;
    owner_id: number;
    owner: PublicUser;
    created_at: string;
    in_care: boolean;
    in_care_id: number | null;
    care_requested: boolean;
    care_start: string | null;
    care_end: string | null;
}

export type OfferStatus = "pending" | "accepted" | "refused" | "cancelled" | "completed";

export interface CareOffer {
    id: number;
    plant_id: number;
    status: OfferStatus;
    created_at: string;
    decided_at: string | null;
    sitter: SitterPublic;
    has_review: boolean;
}

export interface PlantSummary {
    id: number;
    name: string;
    location: string;
    photo_url: string | null;
    owner: PublicUser;
}

export interface MyCareOffer {
    id: number;
    plant_id: number;
    status: OfferStatus;
    created_at: string;
    plant: PlantSummary;
}

export interface Message {
    id: number;
    offer_id: number;
    text: string;
    created_at: string;
    sender: PublicUser;
}

export interface CareLog {
    id: number;
    plant_id: number;
    text: string;
    photo_url: string | null;
    created_at: string;
    author: PublicUser;
}

export interface AdviceRequest {
    id: number;
    plant_id: number;
    question: string;
    status: "open" | "answered" | "closed";
    created_at: string;
    plant: PlantSummary;
}

export interface Me {
    id: number;
    email: string;
    username: string;
    phone: string;
    is_botanist: boolean;
    botanist_verified: boolean;
    is_admin: boolean;
}

export interface BotanistRequest {
    id: number;
    username: string | null;
    email: string | null;
}
