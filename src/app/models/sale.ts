import { Transaction } from "./transaction";

export interface Sale {
  id: number;
  clientId: number;
  clientDni: number;
  transaction: Transaction;
  description:string;
}