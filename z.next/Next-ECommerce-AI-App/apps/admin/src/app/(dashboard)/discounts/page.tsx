import { DiscountCode } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<DiscountCode[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DISCOUNT_SERVICE_URL}/api/discount/list`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const DiscountsPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Discounts</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default DiscountsPage;
