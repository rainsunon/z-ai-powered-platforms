export interface ProductService {
  id: string;
  name: string;
  description?: string;
  price: number;
  sellThis: boolean;
  buyThis: boolean;
  salesTax?: string;
}
