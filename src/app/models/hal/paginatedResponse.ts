import { Page } from "./page"

export interface PaginatedResponse<T>{
    data:T[]
    page: Page
}