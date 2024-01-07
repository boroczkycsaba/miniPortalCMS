import { Button, Grid } from "@mui/material";
import React from "react";

export const DefaultSubmitButton = ({ showSubmitButton, buttonText }) => {
  return (
    <>
      {showSubmitButton && (
        <Grid container alignItems="center" paddingTop={2}>
          <Grid item xs={7} alignItems={"center"}>
            <Button color="primary" type="submit">
              {buttonText}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};
