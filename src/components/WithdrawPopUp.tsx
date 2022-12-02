import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const WithdrawalPopUp = (props) => {
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
      <DialogTitle>Withdraw</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default WithdrawalPopUp;
