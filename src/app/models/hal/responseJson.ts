import { Links } from "./links";
import { Page } from "./page";
import { ResponseList } from "./responseList";

export interface ResponseJSON<T>{
    _embedded: ResponseList<T>;
    _links:Links
    page:Page
}