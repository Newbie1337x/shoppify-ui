import { Transaction } from "./transaction";
import { Provider } from "./provider";

export interface Purchase {
  id: number;
  providerId: number
  transaction: Transaction;
  provider: Provider;
  unitPrice: number;
  description: string;
  pene:string
}
