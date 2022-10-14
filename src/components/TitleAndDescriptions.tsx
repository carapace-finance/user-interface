import { Button, Container, Typography } from "@material-ui/core";

const TitleAndDescriptions = (props) => {
  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h4">
        {props.title}
      </Typography>
      <Typography gutterBottom variant="body1">
        {props.descriptions}
      </Typography>
      {props.buttonExist ? (
        <Button variant="outlined" color="primary" onClick={() => {}}>
          <Typography variant="body2">{props.button}</Typography>
        </Button>
      ) : null}
    </Container>
  );
};

export default TitleAndDescriptions;
