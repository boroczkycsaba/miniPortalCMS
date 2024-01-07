import React from "react";
import { Button, FormHelperText, Grid, Input, InputLabel, TextareaAutosize } from "@mui/material";
import { useForm } from "react-hook-form";
import { SuccessFulSave } from "../components/SuccessFulSave.jsx";
import { useEffect } from "react";
import { useMask } from "@react-input/mask";


export const RestaurantFormData = ({
  onSubmit,
  restaurantData,
  successfulSaved,
  submitButtonText
}) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [restaurantName, setRestaurantName] = React.useState("");
  const [restaurantTaxNumber, setRestaurantTaxNumber] = React.useState("");
  const [restaurantDescription, setRestaurantDescription] = React.useState("");
  const inputTaxNumberRef = useMask({ mask: '__________-__-_', replacement: { _: /\d/ }})
  
  useEffect(() => {
    if (restaurantData  && restaurantData.restaurantName) {
      setRestaurantName(restaurantData.restaurantName);
    }
    if (restaurantData  && restaurantData.restaurantTaxNumber) {
      setRestaurantTaxNumber(restaurantData.restaurantTaxNumber);
    }
    if (restaurantData  && restaurantData.restaurantDescription) {
      setRestaurantDescription(restaurantData.restaurantDescription);
    }
  }, [restaurantData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <h2>Create new resuarant form</h2>
      {successfulSaved && <SuccessFulSave></SuccessFulSave>}
      <Grid container alignItems="left">
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <InputLabel htmlFor="restaurantName">Restaurant name:</InputLabel>
        </Grid>
        <Grid item xs={4}>
          <Input
            fullWidth
            id="restaurantName"
            aria-describedby="restaurantNameText"
            required
            value={restaurantName}
            onChange={(e) => (setRestaurantName(restaurantData.restaurantName = e.target.value))}
          />
          <FormHelperText id="restaurantNameText">
            Please add the resaurant name.
          </FormHelperText>
        </Grid>
      </Grid>
      <Grid container alignItems="left">
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <InputLabel htmlFor="restaurantTaxNumber">Restaurant tax number:</InputLabel>
        </Grid>
        <Grid item xs={4}>
          <Input
            inputRef={inputTaxNumberRef}
            fullWidth
            id="restaurantTaxNumber"
            aria-describedby="restaurantTaxNumberText"
            value={restaurantTaxNumber}
            required
            onChange={(e) => (setRestaurantTaxNumber(restaurantData.restaurantTaxNumber = e.target.value))}
          />
          <FormHelperText id="restaurantTaxNumberText">
            Please add the resaurant code.
          </FormHelperText>
        </Grid>
      </Grid>
      <Grid container alignItems="left">
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <InputLabel htmlFor="restaurantDescription">Restaurant description:</InputLabel>
        </Grid>
        <Grid item xs={6}>
          <TextareaAutosize
            id="restaurantDescription"
            aria-describedby="restaurantDescriptionText"
            value={restaurantDescription}
            onChange={(e) => (setRestaurantDescription(restaurantData.restaurantDescription = e.target.value))}
          />
          <FormHelperText id="restaurantDescriptionText">
             Please write a short description of your restaurant.
          </FormHelperText>
        </Grid>
      </Grid>

      
      <Grid container alignItems="center">
        <Grid item xs={7} alignItems={"center"}>
          <Button color="primary" type="submit">
            {submitButtonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
