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
          borderRadius: "8px"
        }
      }}
    >
      <DialogContent className="px-8">
      <h2 className="mt-4 mb-4">Carapace Playground Mode</h2>
        <p>Following are the things to take into consideration:</p>
        <ul>
          <li>
            You can test different features like deposit, withdrawal request,
            withdrawal, and buy protection
          </li>
          <li>The set up may take some time</li>
        </ul>
      {playground?.poolFactoryAddress ? (
        <button
          className="border rounded-md px-4 py-4 m-8 mb-4 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={onClose}
        >
          <span>Start Playing Around!</span>
        </button>
      ) : (
        <button className="border rounded-md px-4 py-4 m-8 mb-4 transition duration-500 ease select-none focus:outline-none focus:shadow-outline">
          <span>Setting Up the Playground Mode...</span>
        </button>
      )}
      </DialogContent>
    </Dialog>
  );
};

export default PlaygroundModePopUp;
