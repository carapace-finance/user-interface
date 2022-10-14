import Image from "next/image";
import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  toolBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  textButton: {
    padding: theme.spacing(0, 3),
    cursor: "pointer",
    opacity: 0.7,
    "&:hover": {
      opacity: 1
    }
  },
  logo: {
    "&:hover": {
      cursor: "pointer"
    },
    objectFit: "cover"
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
        <Image
          src="/logo.svg"
          alt=""
          className={classes.logo}
          height="30px"
          width="124px"
          unoptimized
        />
        <Typography>
          Accelerate the world's transition to decentralized finance by
          re-imagining how we manage credit.
        </Typography>
    </Container>
  );
};

export default Footer;
