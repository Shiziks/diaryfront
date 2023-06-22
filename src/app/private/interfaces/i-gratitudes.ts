export interface IGratitudes {
    id: number,
    user_id: number,
    gratitudes: string,
    group_id: number,
    created_at: string
}

export interface IGratitudeByGroup {
    gratitudes: string[],
    group_id: number,
    created_at: string
}
