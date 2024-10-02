import * as React from "react";
import { Container, Typography } from "@mui/material";

export default function Footer() {
  const [year, setYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <React.Fragment>
      <Container
        maxWidth="md"
        sx={{ backgroundColor: "white", padding: "1rem 0" }}
      >
        <Typography align="center">
          {`Wild Carbon©  Tous droits réservés. ${year}`}
        </Typography>
      </Container>
    </React.Fragment>
  );
}
