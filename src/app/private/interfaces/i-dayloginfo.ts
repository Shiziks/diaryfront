import { IImages } from "./i-images";

export interface IDayloginfo {
    daylog_id: number,
    title: string,
    text: string,
    user_id: number,
    created_at: string,
    images?: IImages[]
}
