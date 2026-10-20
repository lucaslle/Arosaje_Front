// FastAPI sends `detail` as a string for HTTP errors but as a list for validation errors (422)
export const apiErrorMessage = (data: { detail?: unknown } | null, fallback: string): string =>
    typeof data?.detail === "string" ? data.detail : fallback;
