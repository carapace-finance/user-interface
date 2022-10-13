import { Container, Typography } from "@material-ui/core";

const TitleAndDescriptions = (props) => {
  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h4">
        {props.title}
      </Typography>
      <Typography gutterBottom variant="body1">
        {props.descriptions}
      </Typography>
    </Container>
  );
};

export default TitleAndDescriptions;
