import LoadingButton from "@mui/lab/LoadingButton";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  Drawer,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { convertNumberToUSDC, USDC_FORMAT } from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import numeral from "numeral";
import { WithdrawalInput } from "@type/types";
import useWithdraw from "@/hooks/useWithdraw";
import { X } from "lucide-react";
import Image from "next/image";
import dollarSign from "../assets/dollarSign.png";
import useIsMobile from "@/hooks/useIsMobile";

const WithdrawalPopUp = (props) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid }
  } = useForm<WithdrawalInput>({ defaultValues: { amount: "0" } });

  const { protectionPoolService } = useContext(ApplicationContext);
  const isMobile = useIsMobile();
  const { open, onClose, protectionPoolAddress } = props;
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  // TOOD: update params
  const { prepareFn, writeFn, waitFn } = useWithdraw(
    "1",
    "0x8531EB39FbaEaB9Df406762aAE2C6005A898a092"
  );

  const reset = () => {
    setSuccessMessage("");
    setError("");
    setValue("amount", "0");
    setLoading(false);
  };

  // reset values on each open
  useEffect(() => {
    reset();
  }, [open]);

  const setMaxAmount = async () => {
    setValue("amount", props.requestedWithdrawalAmount);
  };

  const onSubmit = () => {
    writeFn.write();
    // withdraw();
  }; // your form submit function which will invoke after successful validation

  const onError = (e) => {
    if (e) {
      console.log("Error: ", e);
    }
    console.log("The withdrawal transaction failed");
    setError("Failed to withdraw...");
    setTimeout(() => {
      reset();
    }, 2000);
  };

  const withdraw = async () => {
    setLoading(true);

    try {
      const tx = await protectionPoolService.withdraw(
        protectionPoolAddress,
        convertNumberToUSDC(parseFloat(getValues("amount")))
      );
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log("The withdrawal transaction was successful");
        // Show success message for 2 seconds before closing popup
        setSuccessMessage(
          `You successfully withdrew ${getValues(
            "amount"
          )} USDC from the protection pool!`
        );
        setTimeout(() => {
          reset();
          onClose();
        }, 2000);
      } else {
        onError(receipt);
      }
    } catch (e) {
      onError(e);
    }
  };

  return isMobile ? (
    <Drawer
      anchor={'bottom'}
      open={open}
      onClose={loading ? null : onClose}
    >
      <div className="flex justify-end mr-4">
        <IconButton onClick={loading ? null : onClose}>
          <span className="text-black">×</span>
        </IconButton>
      </div>
      <DialogTitle className="py-0 px-4 -mt-4">
        Withdraw
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="px-4">
          <h4 className="text-left text-sm font-medium mb-1">
            Protection Pool
          </h4>
          <div className="flex justify-left mb-4 text-sm">
            Goldfinch Protection Pool #1
          </div>
          <div>
            <h4 className="text-left text-sm font-medium mb-3">
              Withdraw Amount
            </h4>
            <div className="mb-8">
              <div className="flex flex-col  px-4 py-3 rounded-2xl bg-gray-100 ">
                <div className="flex items-center justify-between w-full">
                  <input
                    className="block outline-none text-xl w-full text-black rounded bg-gray-100 out"
                    type="number"
                    {...register("amount", {
                      min: 1,
                      max: numeral(props.requestedWithdrawalAmount).value(),
                      required: true
                    })}
                    onWheel={(e: any) => e.target.blur()}
                  />
                  <div className="flex items-center">
                    <Image
                      src={dollarSign}
                      alt=""
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    USDC
                  </div>
                </div>
                <div className="flex items-center justify-between w-full mt-1">
                  <p className="text-xs text-gray-500">$150002.9</p>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500 mr-2">
                      Requestable Amount:{" "}
                      {numeral(props.requestedWithdrawalAmount).format(
                        USDC_FORMAT
                      )}
                    </p>
                    <p className="text-sm text-customBlue">Max</p>
                  </div>
                </div>
              </div>
              {errors.amount && (
                <h5 className="block text-left text-customPink text-xs md:text-base leading-tight font-normal mb-4 mt-3">
                  the withdrawal amount must be in between 0 and your requested
                  amount
                </h5>
              )}
            </div>
          </div>
          <button
            className={`text-sm md:text-base text-white bg-customBlue rounded-md w-full px-12 py-3 mb-4 mt-2 transition duration-500 ease min-w-[230px] select-none focus:outline-none focus:shadow-outline cursor-pointer ${
              loading ? "disabled:opacity-90" : "disabled:opacity-50"
            } disabled:cursor-not-allowed`}
            type="submit"
            disabled={
              loading ||
              !protectionPoolService ||
              !protectionPoolAddress ||
              !isValid
            }
          >
            {loading ? (
              <LoadingButton loading={loading}>
                <CircularProgress color="secondary" size={16} />
              </LoadingButton>
            ) : (
              "Confirm Withdraw"
            )}
          </button>
          <div className="text-xs text-center">
            By clicking &quot;Confirm Withdraw&quot;, you agree to
            Carapace&apos;s&nbsp;
            <span className="underline">Terms of Service&nbsp;</span>
            and acknowledge that you have read and understand the&nbsp;
            <span className="underline">Carapace protocol disclaimer.</span>
          </div>
        </DialogContent>
      </form>
      <SuccessPopup
        handleClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Drawer>
  ):(
    <Dialog
      className="top-64 md:top-32 md:inset-x-36"
      disableScrollLock
      open={open}
      onClose={loading ? null : onClose}
      PaperProps={{
        sx: {
          borderRadius: { xs: "10px 10px 0px 0px", md: "10px" },
          maxHeight: { xs: "100%", md: "calc(100% - 64px)" },
          margin: { xs: "0px", md: "32px" }
        }
      }}
    >
      <div className="absolute top-3 right-3">
        <IconButton onClick={loading ? null : onClose}>
          <X className="text-black" size={18} />
        </IconButton>
      </div>
      <DialogTitle className="py-0 px-4 mt-6 md:py-3">
        Withdraw
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="px-4">
          <h4 className="text-left text-base font-medium mb-1 md:mb-3">
            Protection Pool
          </h4>
          <div className="flex justify-left mb-3 text-base">
            Goldfinch Protection Pool #1
          </div>
          <div>
            <h4 className="text-left text-base font-medium mb-3">
              Withdraw Amount
            </h4>
            <div className="rounded-2xl mb-4">
              <div>
                <input
                  className="block border-solid border-gray-300 border mb-2 py-2 px-4 w-full rounded text-gray-700"
                  type="number"
                  {...register("amount", {
                    min: 1,
                    max: numeral(props.requestedWithdrawalAmount).value(),
                    required: true
                  })}
                  onWheel={(e: any) => e.target.blur()}
                />
                {errors.amount && (
                  <h5 className="block text-left text-customPink text-base leading-tight font-normal mb-4">
                    the withdrawal amount must be in between 0 and your
                    requested amount
                  </h5>
                )}
                {/* <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" className="flex">
                      <p className="text-customLightBlue pl-6">($)</p>
                      <p>USDC</p>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" className="">
                      <IconButton
                        disabled={!protectionPoolService}
                        onClick={setMaxAmount}
                        size="sm"
                        className="py-1 px-5 bg-transparent text-customLightBlue border border-customLightBlue rounded-xl"
                      >
                        Max
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              /> */}
              </div>
              <div className="text-right mr-5 mb-1 text-base">
                Requested Withdrawal Amount:&nbsp;
                {numeral(props.requestedWithdrawalAmount).format(USDC_FORMAT) +
                  " USDC"}
              </div>
            </div>
          </div>
          <Divider/>
          <div className="pt-4">
            <h4 className="flex justify-left mb-4 text-base font-medium">
              Estimated Stats
            </h4>
            <div className="flex justify-between mb-2">
              <div className="flex justify-left mb-4 text-gray-500 text-sm items-center">
                Expected Network Fees
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
              <div>
                <p className="text-sm">$10.00</p>
              </div>
            </div>
          </div>
          <button
            className={`text-base text-white bg-customBlue rounded-md w-fit px-12 py-4 mb-8 mt-8 transition duration-500 ease min-w-[230px] select-none focus:outline-none focus:shadow-outline cursor-pointer ${
              loading ? "disabled:opacity-90" : "disabled:opacity-50"
            } disabled:cursor-not-allowed`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <LoadingButton loading={loading}>
                <CircularProgress color="secondary" size={16} />
              </LoadingButton>
            ) : (
              "Confirm Withdraw"
            )}
          </button>
          <div className="text-sm text-center">
            By clicking &quot;Confirm Withdraw&quot;, you agree to
            Carapace&apos;s&nbsp;
            <span className="underline">Terms of Service&nbsp;</span>
            and acknowledge that you have read and understand the&nbsp;
            <span className="underline">Carapace protocol disclaimer.</span>
          </div>
        </DialogContent>
      </form>
      <SuccessPopup
        handleClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Dialog>
  );
};

export default WithdrawalPopUp;
