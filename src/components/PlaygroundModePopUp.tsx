import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const PlaygroundModePopUp = (props) => {
  const { open, onClose, playground } = props;

  return (
    <Dialog
      maxWidth="lg"
      disableScrollLock
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "8px"
        }
      }}
    >
      <DialogTitle>Carapace Playground Mode</DialogTitle>
      <DialogContent>
        <span>Following are the things to take into consideration:</span>
        <ul>
          <li>You have 1 ETH and 5000 USDC to test</li>
          <li>
            You can test different features like deposit, withdrawal request,
            withdrawal, and buy protection
          </li>
          <li>The set up may take some time</li>
        </ul>
      </DialogContent>
      {playground?.deployedContracts ? (
        <button
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={onClose}
        >
          <span>Start Playing Around!</span>
        </button>
      ) : (
        <button className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline">
          <span>Setting Up the Playground Mode...</span>
        </button>
      )}
    </Dialog>
  );
};

export default PlaygroundModePopUp;
