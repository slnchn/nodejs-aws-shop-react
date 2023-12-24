import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  cart_id?: string;
  count: number;
};
