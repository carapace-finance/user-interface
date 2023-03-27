import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
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
  tokenRewards: string;
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
    cell: (info) => <div style={{ minWidth: "245px" }}>Dummy Name</div>
  }),
  columnHelper.accessor("protocol", {
    header: () => "Protocol",
    cell: (info) => (
      <span className="flex items-center">
        <Image
          className="mx-auto"
          src={require("@/assets/goldfinch.png")}
          width={24}
          height={24}
          alt={info.getValue()}
        />
        <span className="ml-1">{info.getValue()}</span>
      </span>
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
    cell: (info) => <div className="text-right">8 -10 %</div>
    // TODO: update value
  }),
  // columnHelper.accessor("tokenRewards", {
  //   header: () => (
  //     <div className="flex items-center cursor-pointer justify-end">
  //       CARA Token Rewards
  //       <Tooltip content="TBD" placement="top">
  //         <Info size={16} className="ml-2" />
  //       </Tooltip>
  //     </div>
  //   ),
  //   cell: (info) => <div className="text-right">~ 3.5 %</div>
  //   // TODO: update value
  // }),
  // columnHelper.accessor("timeLeft", {
  //   header: () => (
  //     <div className="flex items-center cursor-pointer justify-start">
  //       Estimated Adjusted Yields
  //       <Tooltip content="Lending Pool APY minus Premium" placement="top">
  //         <Info size={16} className="ml-2" />
  //       </Tooltip>
  //     </div>
  //   ),
  //   cell: (info) => <p>TBD</p>
  // })
];

type Props = {
  pools: any[];
};

const AllLendingPools = ({ pools }: Props) => {
  const router = useRouter();
  // const { lendingPools } = useContext(LendingPoolContext);
  const table = useReactTable({
    data: pools,
    // @ts-ignore
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
                // @ts-ignore */
                router.push(`/lending-pool/${row.original.id}`)
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
                  Buy Protection
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllLendingPools;
