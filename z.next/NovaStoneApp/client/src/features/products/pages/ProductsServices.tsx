import React from "react";
import { toast } from "sonner";
import { ProductService } from "../types";
import { ProductCreateView } from "../components/ProductCreateView";
import { ProductListView } from "../components/ProductListView";

const mockProducts: ProductService[] = [
  { id: "1", name: "IT consulting", price: 100.00, sellThis: true, buyThis: false, salesTax: "HST" },
  { id: "2", name: "service", description: "IT consulting", price: 96.32, sellThis: true, buyThis: false, salesTax: "HST" },
];

export function ProductsServicesPage() {
  const [view, setView] = React.useState<"list" | "create">("list");
  const [products, setProducts] = React.useState<ProductService[]>(mockProducts);
  const [formData, setFormData] = React.useState({ name: "", description: "", price: "0.00", sellThis: false, buyThis: false, salesTax: "" });

  const handleSave = () => {
    const newProduct: ProductService = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price) || 0,
      sellThis: formData.sellThis,
      buyThis: formData.buyThis,
      salesTax: formData.salesTax || undefined,
    };
    setProducts([...products, newProduct]);
    toast.success("Product/Service added successfully");
    setView("list");
    setFormData({ name: "", description: "", price: "0.00", sellThis: false, buyThis: false, salesTax: "" });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product/Service deleted");
  };

  if (view === "create") {
    return <ProductCreateView formData={formData} setFormData={setFormData} onSave={handleSave} />;
  }

  return <ProductListView products={products} onCreateNew={() => setView("create")} onDelete={handleDelete} />;
}
