import { CategoriesEnum } from "@/controllers/refunds-controller";

export interface Refund {
  name: string;
  category: CategoriesEnum;
  amount: number;
  filename: string;
}