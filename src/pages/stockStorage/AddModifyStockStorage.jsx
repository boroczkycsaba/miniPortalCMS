import React from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { useState } from "react";
import {
  addNewStorageItemCompany,
  modifyStorageItem,
  readStorageItem,
} from "../../utility/crudUtilityStockStorage";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage";
import { readCompany } from "../../utility/crudUtilityCompany";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { ErrorOnForm } from "../../components/ErrorOnForm";
import { SuccessFulSave } from "../../components/SuccessFulSave";
import { DefaultSubmitButton } from "../../components/submit/DefaultSubmitButton";
import { createBaseFirestoreData } from "../../utility/crudUtilityHelper";
import "../../stylesheets/stockStorage/AddModifyStockStorage.css";

export const AddModifyStockStorage = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage,
}) => {
  const { user } = useContext(UserContext);
  const [creatorUserUid, setCreatorUserUid] = useState("");
  const [companyUid, setCompanyUid] = useState("");
  const [i18nFormtext, setI18nFormtext] = useState([]);
  const [storageItemFireStroreData, setStorageItemFireStroreData] = useState(
    []
  );
  const [storageItemFirestoreLoaded, setStorageItemFirestoreLoaded] =
    useState(false);
  const [storageItemBaseFormDataDisabled, setStorageItemBaseFormDataDisabled] =
    useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [errorFormMessage, setErrorFormMessage] = useState(null);
  const [successfulSaved, setSuccessfulSaved] = useState(false);
  const param = useParams();
  const [storageItemData, setStorageItemData] = useState({
    id: "",
    name: "",
    virual: "yes",
    address: "",
    aviable: 1,
    status: "NEW",
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
    const fetchData = async () => {
      if (creatorUserUid && !companyFireStroreData?.id) {
        setCompanyFireStroreData(await readCompany(creatorUserUid));
      }
    };
    fetchData().catch(console.error);
  }, [creatorUserUid]);

  useEffect(() => {
    const fetchData = async () => {
      if (!storageItemFirestoreLoaded) {
        setShowSubmitButton(true);
        if (param?.id) {
          setStorageItemFireStroreData(await readStorageItem(param.id));
          if (param?.show) {
            setStorageItemBaseFormDataDisabled(true);
            setShowSubmitButton(false);
          }
        }
        setCompanyUid(companyFireStroreData.id);
        setStorageItemFirestoreLoaded(true);
      }
    };
    fetchData().catch(console.error);
  }, [param?.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (storageItemFirestoreLoaded) {
        let currentPortalLanguge = getCurrentUserLanguage();
        console.debug("currentPortalLanguge storage", currentPortalLanguge);
        if (!currentPortalLanguge) {
          currentPortalLanguge = portalLanguage;
        }
        let isNewStorageItem = true;
        if (storageItemFireStroreData && storageItemFireStroreData?.id) {
          isNewStorageItem = false;
        }
        const i18nFormtextLocal = [];
        if (currentPortalLanguge == "HU") {
          if (storageItemBaseFormDataDisabled) {
            i18nFormtextLocal.storageItemFormHeaderText =
              "Raktár adat megtekintése";
          } else {
            i18nFormtextLocal.storageItemFormHeaderText = isNewStorageItem
              ? "Új raktár adat rögzítése"
              : "Raktár adat módosítása";
          }
          i18nFormtextLocal.storageItemName = "Raktár neve:";
          i18nFormtextLocal.storageItemNameText =
            "Kérjük adja meg a raktár nevét.";
          i18nFormtextLocal.storageItemVirtual = "Virtuális-e a raktár?:";
          i18nFormtextLocal.yes = "Igen";
          i18nFormtextLocal.no = "Nem";
          i18nFormtextLocal.storageItemAddress = "Raktár címe:";
          i18nFormtextLocal.storageItemAddressText =
            "Kérjük adja meg a raktár címét.";
          i18nFormtextLocal.storageItemDescription = "Leírás a raktrárról:";
          i18nFormtextLocal.storageItemDescriptionText =
            "Kérlek adj meg egy leírást a raktrárról.";
          i18nFormtextLocal.storageItemSubmitButtonText = isNewStorageItem
            ? "Új raktár adat mentése"
            : "Raktár adat módosítása";
        } else {
          if (storageItemBaseFormDataDisabled) {
            i18nFormtextLocal.storageItemFormHeaderText = "Show storage item";
          } else {
            i18nFormtextLocal.storageItemFormHeaderText = isNewStorageItem
              ? "New storage item"
              : "Modify storage item";
          }
          i18nFormtextLocal.storageItemName = "Storage item name:";
          i18nFormtextLocal.storageItemNameText =
            " Please add the storage item name.";
          i18nFormtextLocal.userNameLabelText = "User name:";
          i18nFormtextLocal.storageItemVirtual = "Storage item is virtual?";
          i18nFormtextLocal.yes = "Yes";
          i18nFormtextLocal.no = "No";
          i18nFormtextLocal.storageItemAddress = "Storage item address:";
          i18nFormtextLocal.storageItemAddressText =
            " lease add the storage item address.";
          i18nFormtextLocal.storageItemDescription =
            "Storage item description:";
          i18nFormtextLocal.storageItemDescriptionText =
            "Please write a short description of storage item.";
          i18nFormtextLocal.storageItemSubmitButtonText = isNewStorageItem
            ? "Save the new quantity storage item data"
            : "Modify storage item";
        }
        setI18nFormtext(i18nFormtextLocal);
      }
    };
    fetchData().catch(console.error);
  }, [portalLanguage, storageItemFirestoreLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      if (storageItemFirestoreLoaded) {
        let isExistingStorageItem = false;
        if (storageItemFireStroreData && storageItemFireStroreData?.id) {
          isExistingStorageItem = true;
        }
        console.debug("isExistingStorageItem", isExistingStorageItem);
        if (isExistingStorageItem) {
          setValue("storageItemName", storageItemFireStroreData.name);
          setValue("storageItemVirual", storageItemFireStroreData.virual);
          setValue("storageItemAddress", storageItemFireStroreData.address);
          setValue(
            "storageItemDescription",
            storageItemFireStroreData.description
          );

          setStorageItemData({ ...storageItemFireStroreData });

          storageItemData.status = "MODYFIED";
        }
      }
    };
    fetchData().catch(console.error);
  }, [portalLanguage, storageItemFirestoreLoaded]);

  const onSubmit = async (data, e) => {
    event.preventDefault();
    setSuccessfulSaved(false);
    setErrorFormMessage(null);

    if (storageItemFireStroreData?.id) {
      try {
        console.log(storageItemData);
        storageItemData.modifierUserUid = user.uid;
        await modifyStorageItem(
          storageItemFireStroreData.documentId,
          storageItemData
        );
        setSuccessfulSaved(true);
      } catch (error) {
        console.error("An error occurred during save!", error);
      } finally {
        console.debug("Form saved");
      }
    } else {
      try {
        createBaseFirestoreData(storageItemData, user, companyUid);
        console.log("storageItemData", storageItemData);
        const storageItemDataSaved =
          await addNewStorageItemCompany(storageItemData);
        setShowSubmitButton(false);
        setStorageItemBaseFormDataDisabled(true);
        setSuccessfulSaved(true);
      } catch (error) {
        console.error("An error occurred during save!", error);
      } finally {
        console.debug("Form saved");
      }
    }
  };

  return (
    <main>
      <div id="modifyStockStorageDIV">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h2>{i18nFormtext["storageItemFormHeaderText"]}</h2>;
        {errorFormMessage && (
          <ErrorOnForm errorFormMessage={errorFormMessage}></ErrorOnForm>
        )}
        {successfulSaved && <SuccessFulSave></SuccessFulSave>}
        <Grid container alignItems="left">
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            <InputLabel htmlFor="storageItemName">
              {i18nFormtext["storageItemName"]}
            </InputLabel>
          </Grid>
          <Grid item xs={4}>
            <TextField
              {...register("storageItemName", { required: true })}
              fullWidth
              id="storageItemName"
              aria-describedby="storageItemNameText"
              required
              onChange={(e) =>
                setStorageItemData({
                  ...storageItemData,
                  name: e.target.value,
                })
              }
              disabled={storageItemBaseFormDataDisabled}
              helperText={i18nFormtext["storageItemNameText"]}
              error={
                !storageItemBaseFormDataDisabled && storageItemData.name === ""
              }
            />
          </Grid>
        </Grid>
        <Grid container alignItems="left">
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            <FormLabel id="storageItemVirtual">
              {i18nFormtext["storageItemVirtual"]}
            </FormLabel>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <RadioGroup
                defaultValue={storageItemData.virual}
                name="storageItemVirtual"
                orientation="horizontal"
                row={true}
                {...register("storageItemVirual")}
                disabled={storageItemBaseFormDataDisabled}
              >
                <FormControlLabel
                  value="yes"
                  control={
                    <Radio
                      icon={<NotInterestedIcon />}
                      checkedIcon={<DoneOutlineIcon />}
                    />
                  }
                  label={i18nFormtext["yes"]}
                  size="md"
                  onChange={(e) =>
                    setStorageItemData({
                      ...storageItemData,
                      virual: e.target.value,
                    })
                  }
                  disabled={storageItemBaseFormDataDisabled}
                />
                <FormControlLabel
                  value="no"
                  control={
                    <Radio
                      icon={<NotInterestedIcon />}
                      checkedIcon={<DoneOutlineIcon />}
                    />
                  }
                  label={i18nFormtext["no"]}
                  size="md"
                  onChange={(e) =>
                    setStorageItemData({
                      ...storageItemData,
                      virual: e.target.value,
                    })
                  }
                  disabled={storageItemBaseFormDataDisabled}
                />
              </RadioGroup>
            </FormControl>
            <FormHelperText id="storageItemVirtualText">
              {i18nFormtext["storageItemVirtualText"]}
            </FormHelperText>
          </Grid>
        </Grid>
        <Grid container alignItems="left" paddingTop={2}>
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            <InputLabel htmlFor="storageItemAddress">
              {i18nFormtext["storageItemAddress"]}
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register("storageItemAddress")}
              id="storageItemAddress"
              onChange={(e) =>
                setStorageItemData({
                  ...storageItemData,
                  address: e.target.value,
                })
              }
              disabled={storageItemBaseFormDataDisabled}
              required={storageItemData.virual === "no"}
              inputProps={{ maxLength: 100 }}
              helperText={i18nFormtext["storageItemAddressText"]}
              error={
                !storageItemBaseFormDataDisabled &&
                storageItemData.virual === "no" &&
                storageItemData.address === ""
              }
            />
          </Grid>
        </Grid>
        <Grid container alignItems="left" paddingTop={2}>
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            <InputLabel htmlFor="storageItemDescription">
              {i18nFormtext["storageItemDescription"]}
            </InputLabel>
          </Grid>
          <Grid item xs={6}>
            <TextareaAutosize
              {...register("storageItemDescription", { required: true })}
              id="storageItemDescription"
              aria-describedby="storageItemDescriptionText"
              onChange={(e) =>
                setStorageItemData({
                  ...storageItemData,
                  description: e.target.value,
                })
              }
              disabled={storageItemBaseFormDataDisabled}
            />
            <FormHelperText id="storageItemDescriptionText">
              {i18nFormtext["storageItemDescriptionText"]}
            </FormHelperText>
          </Grid>
        </Grid>
        <DefaultSubmitButton
          showSubmitButton={showSubmitButton}
          buttonText={i18nFormtext["storageItemSubmitButtonText"]}
        />
      </form>             
      </div>
    </main>
  );
};
