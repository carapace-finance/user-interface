import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { readableDate } from "@utils/date";

import { PoolCardProps } from "@type/props";

// Card view of a coverage pool. Not used at the moment
const CoverCard = (props: PoolCardProps) => {
  const expDateString = new Date(+props.expiration).toString();
  const expDateTimezone = new Date(+props.expiration)
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
  const readableExpDate: string = `${readableDate(
    expDateString
  )} ${expDateTimezone}`;
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography gutterBottom variant="h6">
          {props.name}
        </Typography>
        <Typography variant="body2">
          <div>Expiration:</div>
          <div>{readableExpDate}</div>
        </Typography>
        <Typography variant="body2">
          <div>Premium:</div>
          <div>{props.premium}</div>
        </Typography>
        <Typography variant="body2">
          <div>Coverage:</div>
          <div>{props.coverage}</div>
        </Typography>
      </CardContent>
      <CardActions>
        <button
          className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
          color="primary"
        >
          Trade
        </button>
      </CardActions>
    </Card>
  );
};

export default CoverCard;
