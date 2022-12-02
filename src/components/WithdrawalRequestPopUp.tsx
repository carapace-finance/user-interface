import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const WithdrawalRequestPopUp = (props) => {
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
      <DialogTitle>Withdrawal Request</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default WithdrawalRequestPopUp;
