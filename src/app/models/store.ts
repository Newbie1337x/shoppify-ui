import { HomeCarousel } from "./homeCarousel";

export interface Store {
  id: number;
  storeName: string;
  adress: string;
  city: string;
  phone:string
  homeCarousel?:HomeCarousel
}
