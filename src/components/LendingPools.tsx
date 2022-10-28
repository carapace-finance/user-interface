import { useState } from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";

import TradePopup from "@components/TradePopup";
import ClaimPopup from "@components/ClaimPopup";
import ErrorPopup from "@components/ErrorPopup";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    "&:nth-child(1) .Component-horizontalScrollContainer-26": {
      borderRadius: theme.spacing(1)
    }
  },
  item: {
    padding: theme.spacing(1)
  },
  containerItem: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: `repeat(2, 1fr)`
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: `repeat(3, 1fr)`
    }
  },
  table: {
    minWidth: 700
  },
  cell: {
    "&:hover": {
      color: `${theme.palette.primary} !important`,
      cursor: "pointer"
    }
  },
  row: {
    display: "flex",
    flexDirection: "row"
  }
}));

// Table of coverage pools
const LendingPools = () => {
  const classes = useStyles();
  const [error, setError] = useState("");

  const [tradeOpen, setTradeOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);

  return (
    <Container className={classes.root} maxWidth="lg">
      <MaterialTable
        style={{
          borderRadius: "10px"
        }}
        columns={[
          {
            title: "Pool",
            field: "pool",
            cellStyle: { fontWeight: 500, width: "18%" },
            disableClick: true
          },
          { title: "Expiry", field: "expiry", cellStyle: { width: "18%" } },
          {
            title: "Defaulted",
            field: "defaulted",
            cellStyle: { width: "0%" }
          },
          {
            title: "Total Supplied",
            field: "totalCoverage",
            cellStyle: { width: "16%" }
          },
          {
            title: "Total Premiums",
            field: "totalPremium",
            cellStyle: { width: "16%" }
          },
          { title: "", field: "action", cellStyle: { width: "18%" } }
        ]}
        data={[
          {
            pool: "Goldfinch CDS",
            expiry: "January 8, 2022 3:22pm EDT",
            defaulted: false,
            totalCoverage: "6508.15 DAI",
            totalPremium: "21915.10 DAI",
            action: (
              <div className={classes.row}>
                <button
                  className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
                  onClick={() => {}}
                >
                  Trade
                </button>
                <button
                  disabled
                  className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
                  onClick={() => {}}
                >
                  Claim
                </button>
              </div>
            )
          },
          {
            pool: "Sublime Finance CDS",
            expiry: "NA",
            defaulted: "NA",
            totalCoverage: "NA",
            totalPremium: "NA",
            balance: "NA",
            action: (
              <div className={classes.row}>
                <button
                  className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
                  disabled={false}
                  onClick={() => {}}
                >
                  Trade
                </button>
                <button
                  disabled={false}
                  className="border rounded-md px-4 py-2 m-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline"
                  onClick={() => {}}
                >
                  Claim
                </button>
              </div>
            )
          }
        ]}
        options={{
          toolbar: false,
          paging: false,
          headerStyle: {
            backgroundColor: "#009DC4",
            color: "#FFF"
          },
          rowStyle: {
            padding: "8px"
          }
        }}
      />
      <TradePopup
        open={tradeOpen}
        onClose={() => {}}
        poolContractAddress="NA"
      />
      <ClaimPopup open={claimOpen} onClose={() => {}} />
      <ErrorPopup error={error} handleCloseError={() => setError("")} />
    </Container>
  );
};

export default LendingPools;
