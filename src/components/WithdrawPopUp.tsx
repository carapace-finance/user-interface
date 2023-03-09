import LoadingButton from "@mui/lab/LoadingButton";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApplicationContext } from "@contexts/ApplicationContextProvider";
import { convertNumberToUSDC, USDC_FORMAT } from "@utils/usdc";
import SuccessPopup from "./SuccessPopup";
import ErrorPopup from "@components/ErrorPopup";
import numeral from "numeral";
import { WithdrawalInput } from "@type/types";
import useWithdraw from "@/hooks/useWithdraw";
import { X } from "lucide-react";

const WithdrawalPopUp = (props) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid }
  } = useForm<WithdrawalInput>({ defaultValues: { amount: "0" } });

  const { protectionPoolService } = useContext(ApplicationContext);
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

  return (
    <Dialog
      className="top-32 inset-x-36"
      disableScrollLock
      open={open}
      onClose={loading ? null : onClose}
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
      <DialogTitle className="mt-6 text-center">Withdraw</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <h4 className="text-left text-base font-medium mb-3">
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
              <div className="text-right mr-5 mb-1">
                Requested Withdrawal Amount:&nbsp;
                {numeral(props.requestedWithdrawalAmount).format(USDC_FORMAT) +
                  " USDC"}
              </div>
            </div>
          </div>
          <button
            className={`text-white bg-customBlue rounded-md px-12 py-4 mb-8 mt-8 transition duration-500 ease min-w-[230px] select-none focus:outline-none focus:shadow-outline cursor-pointer block mx-auto ${
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
    </Dialog>
  );
};

export default WithdrawalPopUp;
