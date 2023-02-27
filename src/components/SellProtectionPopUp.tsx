import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from "@mui/material";
import numeral from "numeral";
import { useSnackbar } from "notistack";
import { convertNumberToUSDC, USDC_FORMAT } from "@/utils/usdc";
import { Tooltip } from "@material-tailwind/react";
import assets from "@/assets";
import useDeposit from "@/hooks/useDeposit";
import Spinner from "@/components/Spinner";
import type { Address } from "abitype";

type Props = {
  open: boolean;
  onClose: () => void;
  amount: string;
  protectionPoolAddress: Address;
  estimatedAPY: string;
};

// Presentational component for handling trades
const SellProtectionPopUp = ({
  open,
  onClose,
  amount,
  protectionPoolAddress,
  estimatedAPY
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [expectedNetworkFee, setExpectedNetworkFee] = useState(5.78); // TODO: implement this
  const { prepareFn, writeFn, waitFn } = useDeposit(
    amount,
    protectionPoolAddress
  );
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    // watch tx confirmation
    if (waitFn.isSuccess) {
      setLoading(false);
      enqueueSnackbar(
        `You successfully deposited ${amount} USDC in to the protection pool!`,
        {
          variant: "success"
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitFn.isSuccess]);

  // Function passed into 'onClick' of 'Sell Protection' button
  const sellProtection = async () => {
    try {
      setLoading(true);
      await writeFn.writeAsync();
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(e.message, {
        variant: "error"
      });
      console.log("Error: ", e.message);
    }
  };

  return (
    <Dialog
      className="inset-x-36"
      disableScrollLock
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "10px"
        }
      }}
    >
      <div className="flex justify-end mr-4">
        <IconButton onClick={onClose}>
          <span className="text-black">×</span>
        </IconButton>
      </div>
      <DialogTitle className="mt-6">Deposit</DialogTitle>
      <DialogContent className="mb-4">
        <div>
          <div className="flex justify-start">
            {renderFieldAndValue("Name", "Goldfinch Protection Pool #1")}
            <div className="-ml-40 mt-1">
              <Image
                src={assets.goldfinch.src}
                alt="carapace"
                height="16"
                width="16"
              />
            </div>
          </div>
          {renderFieldAndValue(
            "Deposit Amount",
            numeral(amount).format(USDC_FORMAT) + " USDC"
          )}
        </div>
        <Divider />
        <div className="mb-8 pt-4">
          <Typography
            className="flex justify-left pb-5 text-gray-900 text-base font-medium"
            variant="subtitle2"
          >
            Estimated Stats
          </Typography>
          <Typography className="flex justify-between pb-3" variant="caption">
            <div className="text-gray-500 text-sm flex items-center">
              Expected APY:
              <div className="pl-2">
                <Tooltip
                  content="Estimated APY for protection sellers."
                  placement="top"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </div>
            </div>
            <div className="text-sm">{estimatedAPY}</div>
          </Typography>
          <Typography className="flex justify-between mb-4" variant="caption">
            <div className="text-gray-500 text-sm flex items-center">
              Expected Network Fees:
              <div className="pl-2">
                <Tooltip
                  content="Fees you pay to the Ethereum network"
                  placement="top"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </div>
            </div>
            <div className="text-sm">
              ${numeral(expectedNetworkFee).format("0.00")}
            </div>
          </Typography>
        </div>
        <div>
          {/* finish tx */}
          {writeFn.isSuccess && waitFn.isSuccess ? (
            <Link
              className="text-white text-base bg-customBlue px-8 py-4 min-w-[230px] rounded-md cursor-pointer"
              href="/portfolio"
            >
              Go to portfolio
            </Link>
          ) : (
            <button
              className={`text-white text-base bg-customBlue px-8 py-4 min-w-[230px] rounded-md cursor-pointer ${
                loading ? "disabled:opacity-90" : "disabled:opacity-50"
              } disabled:cursor-not-allowed`}
              onClick={sellProtection}
              disabled={loading || !protectionPoolAddress || !amount}
            >
              {loading ? (
                <div className="w-5 h-5">
                  <Spinner />
                </div>
              ) : (
                <p>Confirm Deposit</p>
              )}
            </button>
          )}
        </div>
        <div>
          <div className="text-sm mt-4">
            By clicking &quot;Confirm Deposit&quot;, you agree to
            Carapace&apos;s&nbsp;
            <span className="underline">Terms of Service&nbsp;</span>
            and acknowledge that you have read and understand the&nbsp;
            <span className="underline">Carapace protocol disclaimer.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const renderFieldAndValue = (fieldLabel, fieldValue) => {
  return (
    <div>
      <Typography
        className="flex justify-left text-gray-900 text-base font-medium mb-5"
        variant="subtitle2"
      >
        <div>{fieldLabel}</div>
      </Typography>
      <div className="flex justify-left mb-4">{fieldValue}</div>
    </div>
  );
};

export default SellProtectionPopUp;
