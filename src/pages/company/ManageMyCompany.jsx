import React from "react";
import "../../stylesheets/company/ManageMyCompany.css";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { getAllCountries } from "../../utility/crudUtilityCountry.js";
import { Loader } from "../../components/Loader.jsx";
import {
  addNewCompany,
  modifyCompany,
  readCompany,
} from "../../utility/crudUtilityCompany";
import { v4 } from "uuid";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMask } from "@react-input/mask";
import {
  Autocomplete,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { SuccessFulSave } from "../../components/SuccessFulSave.jsx";
import { useState } from "react";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage.js";

export const ManageMyCompany = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage,
}) => {
  const { user } = useContext(UserContext);
  const [creatorUserUid, setCreatorUserUid] = useState("");
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [i18nFormtext, setI18nFormtext] = useState([]);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);
  const [companyFirestoreLoaded, setCompanyFirestoreLoaded] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [successfulSaved, setSuccessfulSaved] = useState(false);
  const [companyData, setCompanyData] = useState({
    id: "",
    name: "",
    countryName: "",
    countryDefaultValue: null,
    taxNumber: "",
    phoneNumber: "",
    faxNumber: "",
    description: "",
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user && user.uid) setCreatorUserUid(user.uid);
  }, [user]);

  useEffect(() => {
    if (companyDataLoaded) {
      let currentPortalLanguge = getCurrentUserLanguage();
      console.debug("currentPortalLanguge", currentPortalLanguge);
      if (!currentPortalLanguge) {
        currentPortalLanguge = portalLanguage;
      }

      const i18nFormtextLocal = [];
      if (currentPortalLanguge == "HU") {
        i18nFormtextLocal.companyName = "Cég neve:";
        i18nFormtextLocal.companyNameText = "Kérem adja meg a cég nevét.";
        i18nFormtextLocal.companyCountryName = "Cég központ országa:";
        i18nFormtextLocal.companyTaxNumber = "Cég adószáma:";
        i18nFormtextLocal.companyTaxNumberText =
          "Kérem adja meg a cég adószámát.";
        i18nFormtextLocal.companyPhoneNumber = "Cég központi telefonszám:";
        i18nFormtextLocal.companyPhoneNumberText =
          "Kérem adja meg közpotni céges telefonszámot.";
        i18nFormtextLocal.companyFaxNumber = "Cég központi fax telefonszám:";
        i18nFormtextLocal.companyFaxNumberText =
          "Kérem adja meg a cég központi fax telefonszámát.";
        i18nFormtextLocal.companyDescription = "Cég rövi leírás:";
        i18nFormtextLocal.companyDescriptionText =
          "Kérem írjon egy rövid leírás a cégéről.";
      } else {
        i18nFormtextLocal.companyName = "Company name:";
        i18nFormtextLocal.companyNameText = "Please add the company name.";
        i18nFormtextLocal.companyCountryName = "Company country:";
        i18nFormtextLocal.companyTaxNumber = "Company tax number:";
        i18nFormtextLocal.companyTaxNumberText =
          "Please add the company tax number.";
        i18nFormtextLocal.companyPhoneNumber = "Company phone number:";
        i18nFormtextLocal.companyPhoneNumberText =
          "Please add the company phone number.";
        i18nFormtextLocal.companyFaxNumber = "Company fax number:";
        i18nFormtextLocal.companyFaxNumberText =
          "Please add the company fax number.";
        i18nFormtextLocal.companyDescription = "Company short description:";
        i18nFormtextLocal.companyDescriptionText =
          "Please write a short description of your company.";
      }

      if (isNewCompany) {
        if (currentPortalLanguge == "HU") {
          i18nFormtextLocal.companyFormHeaderText = "Új cég";
          i18nFormtextLocal.companySubmitButtonText = "Új cég adat mnetése";
        } else {
          i18nFormtextLocal.companyFormHeaderText = "Create new company";
          i18nFormtextLocal.companySubmitButtonText =
            "Save the new company data";
        }
      } else {
        if (portalLanguage == "HU") {
          i18nFormtextLocal.companyFormHeaderText = "Cég adat módosítás";
          i18nFormtextLocal.companySubmitButtonText =
            "Módosított cég adatok mentése";
        } else {
          i18nFormtextLocal.companyFormHeaderText = "Modify company";
          i18nFormtextLocal.companySubmitButtonText = "Modify the company data";
        }
      }
      setI18nFormtext(i18nFormtextLocal);
    }
  }, [portalLanguage, companyDataLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      if (creatorUserUid && !companyFirestoreLoaded) {
        if (companyFireStroreData && companyFireStroreData.uid) {
          setCompanyFirestoreLoaded(true);
        } else {
          setCompanyFireStroreData(await readCompany(creatorUserUid));
        }
        setCompanyFirestoreLoaded(true);
      }
    };

    fetchData().catch(console.error);
  }, [creatorUserUid]);

  useEffect(() => {
    const fetchData = async () => {
      if (companyFirestoreLoaded && !companyDataLoaded) {
        if (companyFireStroreData === undefined) {
          console.debug("No company data found.");
        } else {
          setValue("companyName", companyFireStroreData.name);
          setValue("companyCountryName", companyFireStroreData.countryName);
          setValue("companyTaxNumber", companyFireStroreData.taxNumber);
          setValue("companyPhoneNumber", companyFireStroreData.phoneNumber);
          setValue("companyFaxNumber", companyFireStroreData.faxNumber);
          setValue("companyDescription", companyFireStroreData.description);

          setCompanyData({
            ...companyFireStroreData,
          });
          companyData.countryDefaultValue = {
            id: companyFireStroreData.countryName,
            name: companyFireStroreData.countryName,
          };
        }
        console.debug("companyData", companyData);

        const fetchedCountryData = await getAllCountries();

        let convertedCountryData = fetchedCountryData.map((countryObj) => {
          const countryShortedData = [];

          countryShortedData.id = countryObj.name.common;
          countryShortedData.name = countryObj.name.official;

          return countryShortedData;
        });

        convertedCountryData.sort((a, b) => {
          if (a.name === b.name) return 0;
          return a.name > b.name ? 1 : -1;
        });
        setAllCountries(convertedCountryData);

        if (
          companyFireStroreData === undefined ||
          companyFireStroreData?.creatorUserUid == undefined
        ) {
          setIsNewCompany(true);
        }

        setCompanyDataLoaded(true);
      }
    };

    fetchData().catch(console.error);
  }, [companyFirestoreLoaded]);

  const inputTaxNumberRef = useMask({
    mask: "__________-__-_",
    replacement: { _: /\d/ },
  });
  const inputPhoneNumberRef = useMask({
    mask: "__-(__)-__________",
    replacement: { _: /\d/ },
  });
  const inputPhoneFaxNumberRef = useMask({
    mask: "__-(__)-__________",
    replacement: { _: /\d/ },
  });

  const onSubmit = async (data, e) => {
    event.preventDefault();
    setSuccessfulSaved(false);

    companyData.modifierUserUid = user.uid;
    companyData.modifierUserMail = user.email;

    if (isNewCompany) {
      try {
        companyData.id = v4();
        companyData.creatorUserUid = user.uid;
        companyData.creatorUserMail = user.email;

        console.debug("companyData", companyData);

        await addNewCompany(companyData);

        localStorage.removeItem("miniPortalUserCompany");

        await readCompany(creatorUserUid);

        setSuccessfulSaved(true);
      } catch (error) {
        console.error("An error occurred during save!", error);
      } finally {
      }
    } else {
      try {
        console.debug("data", companyData);
        await modifyCompany(companyFireStroreData.documentId, companyData);
        setSuccessfulSaved(true);
      } catch (error) {
        console.error("An error occurred during save!", error);
      } finally {
        console.debug("Form saved");
      }
    }
  };

  const handleCompanyCountryInputChange = (event, value) => {
    if (value) {
      console.debug("handleCompanyCountryInputChange value", value.id);
      setCompanyData({
        ...companyData,
        countryName: value.name,
        countryDefaultValue: {
          id: value.id,
          name: value.name,
        }
      });
    }
  };

  return (
    <main>
      <div id="manageMyCompanyDIV">
        {!companyDataLoaded && <Loader />}

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <h2>{i18nFormtext["companyFormHeaderText"]}</h2>
          {successfulSaved && <SuccessFulSave></SuccessFulSave>}

          <Grid container alignItems="left">
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="companyName">
                {i18nFormtext["companyName"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register("companyName", { required: true })}
                fullWidth
                id="companyName"
                required
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    name: e.target.value,
                  })
                }
                disabled={!companyDataLoaded}
                helperText={i18nFormtext["companyNameText"]}
                error={companyData.name === ""}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="companyCountryName">
                {i18nFormtext["companyCountryName"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                disablePortal
                id="companyCountryName"
                options={allCountries}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => (option.name ? option.name : "")}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Please select your company country"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
                key={companyData.countryDefaultValue}
                defaultValue={companyData.countryDefaultValue}
                onChange={handleCompanyCountryInputChange}
                disabled={!companyDataLoaded}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="companyTaxNumber">
                {i18nFormtext["companyTaxNumber"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register("companyTaxNumber", { required: true })}
                inputRef={inputTaxNumberRef}
                fullWidth
                id="companyTaxNumber"
                required
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    taxNumber: e.target.value,
                  })
                }
                disabled={!companyDataLoaded}
                helperText={i18nFormtext["companyTaxNumberText"]}
                error={companyData.taxNumber === ""}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="companyPhoneNumber">
                {i18nFormtext["companyPhoneNumber"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register("companyPhoneNumber", { required: true })}
                inputRef={inputPhoneNumberRef}
                fullWidth
                id="companyPhoneNumber"
                required
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    phoneNumber: e.target.value,
                  })
                }
                disabled={!companyDataLoaded}
                helperText={i18nFormtext["companyPhoneNumberText"]}
                error={companyData.phoneNumber === ""}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="companyFaxNumber">
                {i18nFormtext["companyFaxNumber"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register("companyFaxNumber", { required: false })}
                fullWidth
                inputRef={inputPhoneFaxNumberRef}
                id="companyFaxNumber"
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    faxNumber: e.target.value,
                  })
                }
                disabled={!companyDataLoaded}
                helperText={i18nFormtext["companyFaxNumberText"]}
                error={companyData.faxNumber === ""}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="companyDescription">
                {i18nFormtext["companyDescription"]}
              </InputLabel>
            </Grid>
            <Grid item xs={6}>
              <TextareaAutosize
                {...register("companyDescription", { required: false })}
                id="companyDescription"
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    description: e.target.value,
                  })
                }
                disabled={!companyDataLoaded}
              />
              <FormHelperText id="companyDescriptionText">
                {i18nFormtext["companyDescriptionText"]}
              </FormHelperText>
            </Grid>
          </Grid>

          <Grid container alignItems="center">
            <Grid item xs={7} alignItems={"center"}>
              <Button color="primary" type="submit">
                {i18nFormtext["companySubmitButtonText"]}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </main>
  );
};
