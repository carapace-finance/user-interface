import { Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';

const SuccessPopup = (props) => {
  return (
    <Snackbar
      open={props.message ? true : false}
      autoHideDuration={6000}
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
    >
      <Alert onClose={props.handleClose} severity="success">
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessPopup;
