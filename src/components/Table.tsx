import { Container, Typography } from "@material-ui/core";

const Table = (props) => {
  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h6">
        {props.title}
      </Typography>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>id</th>
            <th>Lending Pool</th>
            <th>Protocols</th>
            <th>Adjusted Yields</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1</td>
            <td>Almavest Basket #6</td>
            <td>Goldfinch</td>
            <td>7 - 10%</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>Almavest Basket #6</td>
            <td>Goldfinch</td>
            <td>7 - 10%</td>
          </tr>
          <tr>
            <td>#3</td>
            <td>Almavest Basket #6</td>
            <td>Goldfinch</td>
            <td>7 - 10%</td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
};

export default Table;
