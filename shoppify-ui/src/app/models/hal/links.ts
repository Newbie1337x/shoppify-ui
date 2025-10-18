export interface Links {
  self?: { href: string };
  [rel: string]: { href: string } | undefined; 
}