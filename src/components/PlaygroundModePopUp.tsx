import { Dialog, DialogContent } from "@mui/material";

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
      <DialogContent>
        The application is running in playground mode.
      </DialogContent>
      <DialogContent>
        <ul>
          <li>
            While in simulation mode, you'll be able to explore some features
            with a starting balance of ??? ETH.
          </li>
          <li>
            Feel free to explore and play around for as long as you'd like.
          </li>
        </ul>
      </DialogContent>
      {playground?.snapshotId ? (
        <button
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          onClick={onClose}
        >
          <span>Start Playing Around</span>
        </button>
      ) : (
        <div>please be patient...wait...</div>
      )}
    </Dialog>
  );
};

export default PlaygroundModePopUp;
