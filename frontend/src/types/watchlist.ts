export interface WatchlistItem {
    id: number;
    content_type: number;
    content_type_name: string;
    object_id: number;
    content_object_detail: {
        title: string;
        slug: string;
        poster: string | null;
        type: "movie" | "series";
    };
    added_at: string;
}
