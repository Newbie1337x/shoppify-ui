export interface ResponseList<T> {
  responseList?: T[];
  [key: string]: T[] | undefined;
}
