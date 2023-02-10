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
              onClick={() => router.push(`/protection-pool/${row.address}`)}
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
    // <table className="table-fixed w-full">
    //   <thead>
    //     <tr className="text-left text-sm font-bold">
    //       <th className="py-8 pl-8">
    //         <div className="flex flex-row justify-start mr-4">
    //           <p className="mr-4">Name</p>
    //           <Tooltip
    //             animate={{
    //               mount: { scale: 1, y: 0 },
    //               unmount: { scale: 0, y: 25 }
    //             }}
    //             content="The name of the underlying lending pool for which you can buy protection"
    //             placement="top"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               strokeWidth={1.5}
    //               stroke="#6E7191"
    //               className="w-4 h-4"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    //               />
    //             </svg>
    //           </Tooltip>
    //         </div>
    //       </th>
    //       <th className="py-8">Protocol</th>
    //       <th className="py-8">
    //         <div className="flex flex-row justify-start mr-4">
    //           <p className="mr-4">Estimated Premium</p>
    //           <Tooltip
    //             animate={{
    //               mount: { scale: 1, y: 0 },
    //               unmount: { scale: 0, y: 25 }
    //             }}
    //             content="Estimated premium amount divided your lending amount"
    //             placement="top"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               strokeWidth={1.5}
    //               stroke="#6E7191"
    //               className="w-4 h-4"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    //               />
    //             </svg>
    //           </Tooltip>
    //         </div>
    //       </th>
    //       <th className="py-8">
    //         <div className="flex flex-row justify-start mr-4">
    //           <p className="mr-4">Lending Pool APY</p>
    //           <Tooltip
    //             animate={{
    //               mount: { scale: 1, y: 0 },
    //               unmount: { scale: 0, y: 25 }
    //             }}
    //             content="APY in an underlying lending protocol"
    //             placement="top"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               strokeWidth={1.5}
    //               stroke="#6E7191"
    //               className="w-4 h-4"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    //               />
    //             </svg>
    //           </Tooltip>
    //         </div>
    //       </th>
    //       <th className="py-8">
    //         <div className="flex flex-row justify-start mr-4">
    //           <p className="mr-4">Estimated Adjusted Yields</p>
    //           <Tooltip
    //             animate={{
    //               mount: { scale: 1, y: 0 },
    //               unmount: { scale: 0, y: 25 }
    //             }}
    //             content="Lending Pool APY minus Premium"
    //             placement="top"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               strokeWidth={1.5}
    //               stroke="#6E7191"
    //               className="w-4 h-4"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    //               />
    //             </svg>
    //           </Tooltip>
    //         </div>
    //       </th>
    //       <th className="py-8">
    //         <div className="flex flex-row justify-start mr-4">
    //           <p className="mr-4">Buy Protection Within</p>
    //           <Tooltip
    //             animate={{
    //               mount: { scale: 1, y: 0 },
    //               unmount: { scale: 0, y: 25 }
    //             }}
    //             content="Time left to buy protection for this lending pool"
    //             placement="top"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               strokeWidth={1.5}
    //               stroke="#6E7191"
    //               className="w-4 h-4"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    //               />
    //             </svg>
    //           </Tooltip>
    //         </div>
    //       </th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {lendingPools.map((lendingPool) => (
    //       <tr
    //         key={lendingPool.address}
    //         onClick={() =>
    //           handleClick(
    //             `/lending-pool/${lendingPool.address}?protectionPoolAddress=${lendingPool.protectionPoolAddress}`
    //           )
    //         }
    //         className="text-left text-sm font-medium hover:cursor-pointer hover:bg-gray-50 pb-8"
    //       >
    //         <td className="py-8 pl-8">{lendingPool.name}</td>
    //         <td className="py-8">
    //           <Image src={lendingPool.protocol} width={24} height={24} alt="" />
    //         </td>
    //         <td className="py-8">{lendingPool.premium}</td>
    //         <td className="py-8">{lendingPool.lendingPoolAPY}</td>
    //         <td className="py-8">{lendingPool.adjustedYields}</td>
    //         <td className="py-6">{lendingPool.timeLeft}</td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  );
};

export default AllLendingPools;
