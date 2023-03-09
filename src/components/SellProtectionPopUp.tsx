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
import { X } from "lucide-react";

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
      <div className="absolute top-3 right-3">
        <IconButton onClick={loading ? null : onClose}>
          <X className="text-black" size={18} />
        </IconButton>
      </div>
      <div className="mt-8" />
      <DialogTitle className="text-center">Deposit</DialogTitle>
      <DialogContent className="mb-4 mx-4">
        <div>
          {renderFieldAndValue(
            "Protection Pool",
            "Goldfinch Protection Pool #1"
          )}
          {renderFieldAndValue(
            "Deposit Amount",
            numeral(amount).format(USDC_FORMAT) + " USDC"
          )}
          {renderFieldAndValue("Minimum Locking Period", "95 Days")}
        </div>
        <div className="mt-8 mb-4 flex justify-center">
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
          <div className="text-xs mt-6 text-center">
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
