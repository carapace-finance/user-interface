import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

const PlaygroundModePopUp = (props) => {
  const { open, onClose } = props;

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
        <IconButton aria-label="close" onClick={onClose} size="small">
          close
        </IconButton>
      </DialogContent>
      <DialogContent>
        <ul>
          <li>
            While in simulation mode, you'll be able to explore some features
            with a starting balance of 1 ETH.
          </li>
          <li>
            Feel free to explore and play around for as long as you'd like.
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default PlaygroundModePopUp;
