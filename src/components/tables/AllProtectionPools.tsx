import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
// import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
// import { useContext } from "react";
import { useRouter } from "next/router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Info } from "lucide-react";
import { getDecimalDivFormatted } from "@/utils/utils";
import { USDC_NUM_OF_DECIMALS } from "@/utils/usdc";

type ProtectionPool = {
  name: string;
  protocols: string;
  APY: string;
  totalSTokenUnderlying: string;
  totalProtection: string;
};

const columnHelper = createColumnHelper<ProtectionPool>();

const columns = [
  columnHelper.accessor("name", {
    header: () => <div className="text-left">Name</div>,
    cell: (info) => (
      <div style={{ minWidth: "245px" }}>
        Goldfinch Protection Pool #1
        {/* TODO: functionalization {info.getValue()} */}
      </div>
    )
  }),
  columnHelper.accessor("protocols", {
    header: () => "Protocols",
    cell: (info) => (
      <span className="flex items-center">
        <Image
          className="mx-auto"
          src={require("@/assets/goldfinch.png")}
          width={24}
          height={24}
          alt="Goldfinch"
        />
        GoldFinch
      </span>
      // TODO: functionalization
    )
  }),
  columnHelper.accessor("APY", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-end">
        Estimated APY
        <Tooltip
          content="Estimated APY excluding token rewards"
          placement="top"
        >
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => <div className="text-right">{info.getValue()}</div>
  }),
  columnHelper.accessor("totalSTokenUnderlying", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-end">
        Total Value Locked
        <Tooltip
          content="How much capital have been deposited to this pool"
          placement="top"
        >
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => (
      <div className="text-right">
        {getDecimalDivFormatted(info.getValue(), USDC_NUM_OF_DECIMALS, 0)} USDC
      </div>
    )
  }),
  columnHelper.accessor("totalProtection", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-end">
        Total Protection
        <Tooltip
          content="How much protection have been bought by all the buyers"
          placement="top"
        >
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => (
      <div className="text-right">
        {getDecimalDivFormatted(info.getValue(), USDC_NUM_OF_DECIMALS, 0)} USDC
      </div>
    )
  })
];

const AllProtectionPools = ({ pools }: { pools: any[] }) => {
  const router = useRouter();
  // const { protectionPools } = useContext(ProtectionPoolContext);

  const table = useReactTable({
    data: pools,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="w-full overflow-auto">
      <table className="w-full">
        <thead className="font-medium text-sm text-customGrey">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="px-4 py-6 whitespace-nowrap"
                  key={header.id}
                  style={{
                    width:
                      header.getSize() !== 150 ? header.getSize() : undefined
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
              <th> {/* action */}</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-customPristineWhite border-b hover:bg-customPristineWhite cursor-pointer"
              onClick={() =>
                // @ts-ignore
                router.push(`/protection-pool/${row.original.id}`)
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-6">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {/* action */}
              <td className="px-4 py-6">
                <button className="btn-outline rounded-md px-4 py-1 text-sm">
                  Deposit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProtectionPools;
