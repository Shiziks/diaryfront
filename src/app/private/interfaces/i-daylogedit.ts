import { IImages } from "./i-images";

export interface Idaylogedit {
    created_at: string,
    daylog_id: number,
    text: string,
    title: string,
    images?: IImages[]
}
