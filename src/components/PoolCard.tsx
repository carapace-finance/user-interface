import { Card, CardActions, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import { PoolCardProps } from "@type/props";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: theme.spacing(27),
    [theme.breakpoints.up("md")]: {
      width: theme.spacing(38)
    },
    textAlign: "center",
    padding: theme.spacing(2)
  },
  content: {
    display: "flex",
    justifyContent: "space-between"
  },
  actions: {
    display: "flex",
    justifyContent: "center"
  }
}));

// Card view of a coverage pool. Not used at the moment
const CoverCard = (props: PoolCardProps) => {
  const classes = useStyles();
  const expDateString = new Date(+props.expiration).toString();
  const expDateTimezone = new Date(+props.expiration)
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  const readableExpDate: string = `${moment(expDateString).format(
    "MMMM d, YYYY h:mma"
  )} ${expDateTimezone}`;
  return (
    <Card className={classes.root} elevation={2}>
      <CardContent>
        <Typography gutterBottom variant="h6">
          {props.name}
        </Typography>
        <Typography className={classes.content} variant="body2">
          <div>Expiration:</div>
          <div>{readableExpDate}</div>
        </Typography>
        <Typography className={classes.content} variant="body2">
          <div>Premium:</div>
          <div>{props.premium}</div>
        </Typography>
        <Typography className={classes.content} variant="body2">
          <div>Coverage:</div>
          <div>{props.coverage}</div>
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <button
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          color="primary"
          variant="contained"
        >
          Trade
        </button>
      </CardActions>
    </Card>
  );
};

export default CoverCard;
