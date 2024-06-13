export interface Photo {
    id: number;
    album_id?: number;
    can_comment?: number;
    comments?: { count: number };
    owner_id: number;
    date?: number;
    has_tags?: boolean;
    likes?: { count: number, user_likes: number };
    post_id?: number;
    reposts?: { count: number };
    sizes?: { height: number; type: string; url: string; width: number }[];
    square_crop?: string;
    tags?: { count: number };
    text?: string;
    web_view_token?: string;
}

export interface Album {
    id: number;
    title?: string;
    sizes?: { type: string; height: number; src: string; url: string; width: number }[];
    can_delete?: boolean;
    can_include_to_feed?: boolean;
    created?: number;
    description?: string;
    feed_disabled?: number;
    feed_has_pinned?: number;
    is_locked?: boolean;
    owner_id?: number;
    privacy_comment?: { category: string; lists: any; owners: any };
    privacy_view?: { category: string; lists: any; owners: any };
    size?: number;
    thumb_id?: number;
    thumb_is_last?: number;
    updated?: number;
}

