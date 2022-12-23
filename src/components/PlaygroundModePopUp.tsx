import { LendingPoolContext } from "@contexts/LendingPoolContextProvider";
import { ProtectionPoolContext } from "@contexts/ProtectionPoolContextProvider";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogContent } from "@mui/material";
import { useContext } from "react";

const PlaygroundModePopUp = (props) => {
  const { open, onClose, playground } = props;

  const { lendingPools } = useContext(LendingPoolContext);
  const { isDefaultData, protectionPools } = useContext(ProtectionPoolContext);

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
              You can test different features in our playground mode:
            </h4>
            <ul className="list-disc pl-4">
              <li>buy protection</li>
              <li>sell protection(deposit)</li>
              <li>make a request to withdraw</li>
              <li>withdraw</li>
            </ul>
            <p className="mt-2">
              *You have no need to use your wallet and there is no real money.
            </p>
            {!isDefaultData &&
            protectionPools?.length > 0 &&
            lendingPools?.length > 0 ? (
              <button
                className="border rounded-full border-customDarkGrey text-customDarkGrey w-full px-4 py-4 mt-8 mb-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
                onClick={onClose}
              >
                <span>Start Playing Around!</span>
              </button>
            ) : (
              <button
                className="border rounded-full border-gray-400  w-full px-4 py-4 mt-8 mb-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
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
