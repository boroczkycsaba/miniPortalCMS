import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Grid, InputLabel, TextField } from "@mui/material";

export const UserDisplayForm = ({ user, userNameLabelText, userNameHelperText}) => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      setDataIsLoaded(true);
    }
  }, [user]);

  return (
    <>
      {dataIsLoaded && (
        <Grid container alignItems="left" paddingTop={2}>
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            <InputLabel htmlFor="userName">
              {userNameLabelText}
            </InputLabel>
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              fullWidth
              id="userName"
              disabled={true}
              defaultValue={user.email}
              helperText={userNameHelperText}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};
