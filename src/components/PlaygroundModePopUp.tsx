import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const PlaygroundModePopUp = (props) => {
  const { open, onClose, playground } = props;

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
          <h2 className="mt-6 mb-8 font-medium text-2xl">Carapace Playground Mode</h2>
          <div className="text-left text-customPopupGrey w-96">
            <p>Following are the things to take into consideration:</p>
            <ul className="list-disc pl-4">
              <li>
                You can test different features like deposit, withdrawal request,
                withdrawal, and buy protection
              </li>
              <li>The set up may take some time</li>
            </ul>
            {playground?.poolFactoryAddress ? (
            <button
              className="border rounded-full border-gray-400  w-full px-4 py-4 mt-8 mb-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              <span>Start Playing Around!</span>
            </button>
          ) : (
            <button className="border rounded-full border-gray-400  w-full px-4 py-4 mt-8 mb-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline">
              <span>Setting Up the Playground Mode...</span>
            </button>
          )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaygroundModePopUp;
