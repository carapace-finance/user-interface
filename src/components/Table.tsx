import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    "&:nth-child(1) .Component-horizontalScrollContainer-26": {
      borderRadius: theme.spacing(1)
    }
  },
  card: {
    padding: theme.spacing(3),
    margin: theme.spacing(2, 0),
    maxWidth: theme.spacing(20),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
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
  button: {
    display: "inline",
    width: "100%"
  }
}));

const Table = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="md">
      <Typography gutterBottom variant="h6">
        {props.title}
      </Typography>
      <MaterialTable
        title={"My Balance"}
        style={{
          borderRadius: "10px"
        }}
        columns={[
          {
            title: "id",
            field: "id",
            cellStyle: { fontWeight: 500, width: "25%" },
            disableClick: true
          },
          {
            title: "Lending Pool",
            field: "lending_pool",
            cellStyle: { width: "25%" }
          },
          {
            title: "Protocols",
            field: "protocols",
            cellStyle: { width: "25%" }
          },
          {
            title: "Adjusted Yields",
            field: "adjusted_yields",
            cellStyle: { width: "25%" }
          }
        ]}
        data={[
          {
            id: "#1",
            lending_pool: "Almavest Basket #6",
            protocols: "NA",
            adjusted_yields: "7 - 10%"
          }
        ]}
        options={{
          toolbar: false,
          paging: false
        }}
      />
    </Container>
  );
};

export default Table;
