import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

const PlaygroundModePopUp = (props) => {
  const { open, onClose } = props;

  return (
    <Dialog
      fullScreen
      fullWidth
      maxWidth="lg"
      disableScrollLock
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "10px"
        }
      }}
    >
      <DialogTitle>The application is running in playground mode.</DialogTitle>
      <DialogContent>
        <div>
          While in simulation mode, you'll be able to explore some features with
          a starting balance of 1 ETH. Feel free to explore and play around for
          as long as you'd like.
        </div>
        <IconButton aria-label="close" onClick={onClose} size="small">
          close
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default PlaygroundModePopUp;
