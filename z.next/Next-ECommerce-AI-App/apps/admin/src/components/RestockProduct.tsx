"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";

const RestockFormSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  note: z.string().optional(),
});

interface RestockProductProps {
  productId: string;
  productName: string;
  currentStock: number;
}

const RestockProduct = ({ productId, productName, currentStock }: RestockProductProps) => {
  const form = useForm<z.infer<typeof RestockFormSchema>>({
    resolver: zodResolver(RestockFormSchema),
    defaultValues: {
      quantity: 0,
      note: "",
    },
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof RestockFormSchema>) => {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/api/inventory/${productId}/restock`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to restock product!");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Product restocked successfully");
      form.reset();
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Restock Product</SheetTitle>
        <SheetDescription asChild>
          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-md">
              <p className="text-sm font-medium">{productName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Current Stock: {currentStock} units
              </p>
            </div>

            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              >
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity to Add</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Number of units to add to inventory
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="e.g., Received from supplier XYZ"
                        />
                      </FormControl>
                      <FormDescription>
                        Add a note about this restock
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">New Stock Level</p>
                  <p className="text-2xl font-bold mt-1">
                    {currentStock + (form.watch("quantity") || 0)} units
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  {mutation.isPending ? "Restocking..." : "Restock Product"}
                </Button>
              </form>
            </Form>
          </div>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default RestockProduct;
