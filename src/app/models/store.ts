import { Carouselitem } from "./carouselitem";

export interface Store {
  id: number;
  storeName: string;
  address: string;
  city: string;
  phone:string
  twitter: string
  facebook:string
  instagram:string
  homeCarousel?:Carouselitem[]
}
