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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { Switch } from "./ui/switch";


const DiscountFormSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(0, "Value must be positive"),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.number().optional(),
  minOrderValue: z.number().optional(),
  applicableProducts: z.string().optional(),
  applicableUsers: z.string().optional(),
});

const AddDiscount = () => {
  const form = useForm<z.infer<typeof DiscountFormSchema>>({
    resolver: zodResolver(DiscountFormSchema),
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      value: 0,
      isActive: true,
      startDate: "",
      endDate: "",
      usageLimit: undefined,
      minOrderValue: undefined,
      applicableProducts: "",
      applicableUsers: "",
    },
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof DiscountFormSchema>) => {
      const token = await getToken();
      
      // Transform data
      const payload = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        applicableProducts: data.applicableProducts
          ? data.applicableProducts.split(",").map((id) => id.trim())
          : undefined,
        applicableUsers: data.applicableUsers
          ? data.applicableUsers.split(",").map((id) => id.trim())
          : undefined,
      };

      // console.log("Payload to be sent:", payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DISCOUNT_SERVICE_URL}/api/discount/create`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create discount!");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Discount created successfully");
      form.reset();
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Discount</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SAVE20" />
                      </FormControl>
                      <FormDescription>
                        Unique code customers will use
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                            <SelectItem value="FIXED">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Percentage or fixed dollar amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
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
                        {form.watch("type") === "PERCENTAGE"
                          ? "Percentage off (e.g., 20 for 20%)"
                          : "Dollar amount off (e.g., 10 for $10)"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Enable or disable this discount
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the discount becomes active
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the discount expires
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of times this code can be used
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minOrderValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Value (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum cart value required to use this discount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableProducts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicable Products (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="product-id-1, product-id-2" />
                      </FormControl>
                      <FormDescription>
                        Comma-separated product IDs (leave empty for all products)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicable Users (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="user-id-1, user-id-2" />
                      </FormControl>
                      <FormDescription>
                        Comma-separated user IDs (leave empty for all users)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  {mutation.isPending ? "Creating..." : "Create Discount"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddDiscount;
