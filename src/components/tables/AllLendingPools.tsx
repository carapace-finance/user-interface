import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import { useContext } from "react";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { useRouter } from "next/router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Info } from "lucide-react";

type LendingPool = {
  name: string;
  protocol: string;
  premium: string;
  lendingPoolAPY: string;
  adjustedYields: string;
  timeLeft: string;
};

const columnHelper = createColumnHelper<LendingPool>();

const columns = [
  columnHelper.accessor("name", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-start">
        Name
        <Tooltip
          content="The name of the underlying lending pool for which you can buy protection"
          placement="top"
        >
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => <div style={{ minWidth: "245px" }}>{info.getValue()}</div>
  }),
  columnHelper.accessor("protocol", {
    header: () => "Protocol",
    cell: (info) => (
      <Image
        className="mx-auto"
        src={info.getValue()}
        width={24}
        height={24}
        alt=""
      />
    )
  }),
  columnHelper.accessor("premium", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-end">
        Estimated Premium
        <Tooltip
          content="Estimated premium amount divided your lending amount"
          placement="top"
        >
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => <div className="text-right">{info.getValue()}</div>
  }),
  columnHelper.accessor("lendingPoolAPY", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-end">
        Lending Pool APY
        <Tooltip
          content="APY in an underlying lending protocol"
          placement="top"
        >
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => <div className="text-right">{info.getValue()}</div>
  }),
  columnHelper.accessor("adjustedYields", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-end">
        Estimated Adjusted Yields
        <Tooltip content="Lending Pool APY minus Premium" placement="top">
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => <div className="text-right">{info.getValue()}</div>
  }),
  columnHelper.accessor("timeLeft", {
    header: () => (
      <div className="flex items-center cursor-pointer justify-start">
        Estimated Adjusted Yields
        <Tooltip content="Lending Pool APY minus Premium" placement="top">
          <Info size={16} className="ml-2" />
        </Tooltip>
      </div>
    ),
    cell: (info) => info.getValue()
  })
];

const AllLendingPools = () => {
  const router = useRouter();
  const { lendingPools } = useContext(LendingPoolContext);
  const table = useReactTable({
    data: lendingPools,
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
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-customPristineWhite border-b hover:bg-customPristineWhite cursor-pointer"
              onClick={() =>
                // @ts-ignore */
                router.push(`/lending-pool/${row.original.address}`)
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-6">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllLendingPools;
