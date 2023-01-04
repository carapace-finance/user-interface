import { useRouter } from "next/router";
import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent } from "@mui/material";
import { useContext } from "react";

const PlaygroundModePopUp = (props) => {
  const { open, onClose, playground } = props;

  const { lendingPools } = useContext(LendingPoolContext);
  const { isDefaultData, protectionPools } = useContext(ProtectionPoolContext);

  const router = useRouter();

  const handleClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else if (reason === "escapeKeyDown") {
      console.log(reason);
    } else {
      return onClose;
    }
  };

  return (
    <Dialog
      maxWidth="lg"
      disableScrollLock
      open={open}
      onClose={handleClose}
      BackdropProps={{ style: { backgroundColor: "#FFFFFFE6" } }}
      PaperProps={{
        style: {
          borderRadius: "16px"
        }
      }}
    >
      <DialogContent>
        <div className="px-8">
          <h2 className="mt-6 mb-8 font-medium text-2xl">
            Carapace Playground Mode
          </h2>
          <div className="text-left text-customPopupGrey w-96">
            <h4 className="mb-2">
              You can test different features with no wallet or money:
            </h4>
            <ol className="pl-6 list-decimal">
              <li>Buy protection</li>
              <li>Sell protection(deposit)</li>
              <li>Withdrawal request</li>
              <li>Withdraw</li>
            </ol>
            <p className="text-customPink mt-4">
              *All the data including APY and premium shown in this test app is dummy.
            </p>
            {!isDefaultData &&
            protectionPools?.length > 0 &&
            lendingPools?.length > 0 ? (
              <button
                className="w-full text-white bg-customBlue rounded-md px-12 py-4 mb-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline cursor-pointer disabled:opacity-50 disabled:cursor-none"
                onClick={() => {
                  router.push("/portfolio");
                  onClose();
                }}
              >
                <span>Start Playing Around!</span>
              </button>
            ) : (
              <button
                className=" w-full border rounded-md border-gray-400 px-12 py-4 mb-4 mt-8 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
                disabled
              >
                <span>
                  Setting Up Playground Mode...
                  <LoadingButton loading={true}></LoadingButton>
                </span>
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaygroundModePopUp;
