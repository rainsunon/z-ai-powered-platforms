import { InventoryItem } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

const getData = async (): Promise<InventoryItem[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/api/inventory/list`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const InventoryPage = async () => {
  const data = await getData();
  
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <h1 className="font-semibold">Inventory Management</h1>
        <Link
          href={`${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/api/inventory/export-csv`}
          target="_blank"
        >
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default InventoryPage;
