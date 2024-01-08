import React from "react";
import "../../stylesheets/stock/AddModifyStock.css";
import {
  addNewStockItem,
  modifyStockItem,
  modifyStockItemQuantity,
  readStock,
} from "../../utility/crudUtilityStock";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../../context/UserContext";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  InputLabel,
  TextField,
  TextareaAutosize,
  Tooltip,
  Radio,
  FormLabel,
} from "@mui/material";
import { SuccessFulSave } from "../../components/SuccessFulSave";
import { useParams } from "react-router-dom";
import { readCompany } from "../../utility/crudUtilityCompany";
import { ErrorOnForm } from "../../components/ErrorOnForm";
import { useMask } from "@react-input/mask";
import { UploadFileRounded } from "@mui/icons-material";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import { uploadDocument } from "../../utility/uploadFile";
import { createStockItemModifiedQuantity } from "../../utility/crudUtilityStockQuantity";
import {
  addNewUserStockItem,
  modifyUserStockItem,
  readUserStockItem,
} from "../../utility/crudUtilityUserStock";
import { UserDisplayForm } from "../../components/user/UserDisplayForm";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage";
import { readStorageItems } from "../../utility/crudUtilityStockStorage";
import { createStockItemSalable } from "../../utility/crudUtilityStockSalable";
import { createBaseFirestoreData } from "../../utility/crudUtilityHelper";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

export const AddModifyStock = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage,
}) => {
  const { user } = useContext(UserContext);
  const [creatorUserUid, setCreatorUserUid] = useState("");
  const [companyUid, setCompanyUid] = useState("");
  const [i18nFormtext, setI18nFormtext] = useState([]);
  const [stockItemFireStroreData, setStockItemFireStroreData] = useState([]);
  const [stockItemFirestoreLoaded, setStockItemFirestoreLoaded] =
    useState(false);
  const [showUploadFileComponent, setShowUploadFileComponent] =
    React.useState(false);
  const [selectedDocumentFile, setSelectedDocumentFile] = React.useState(null);
  const [selectedQuantityDocumentFile, setSelectedQuantityDocumentFile] =
    React.useState(null);
  const [selectedImageFile, setSelectedImageFile] = React.useState(null);
  const [stockItemDataLoaded, setStockItemDataLoaded] = useState(false);
  const [stockItemQuantityModify, setStockItemQuantityModify] = useState(false);
  const [stockItemScrappingModify, setStockItemScrappingModify] =
    useState(false);
  const [stockItemUserAdd, setStockItemUserAdd] = useState(false);
  const [stockItemUserRemove, setStockItemUserRemove] = useState(false);
  const [stockItemBaseFormDataDisabled, setStockItemBaseFormDataDisabled] =
    useState(false);
  const [
    stockItemUnmodifiableFormDataDisabled,
    setStockItemUnmodifiableFormDataDisabled,
  ] = useState(false);
  const [stockItemIssSalable, setStockItemIssSalable] = useState("no");
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [errorFormMessage, setErrorFormMessage] = useState(null);
  const [successfulSaved, setSuccessfulSaved] = useState(false);
  const param = useParams();
  const [stockItemData, setStockItemData] = useState({
    id: "",
    name: "",
    barcode: "",
    quantity: 0,
    aviable: 1,
    status: "NEW",
    description: "",
  });

  const [storageItemData, setStorageItemData] = useState({
    allCompanyStorages: [],
    storageDefaultValue: null,
  });

  const [stockItemQuantityData, setStockItemQuantityData] = useState({
    id: "",
    name: "",
    modifiedQuantity: 0,
    status: "NEW",
    quantityDescription: "",
  });

  const [stockItemsSalableData, setStockItemsSalableData] = useState({
    id: "",
    name: "",
    price: 0,
    status: "NEW",
  });

  const addQuantityNumberRef = useMask({
    mask: "_________",
    replacement: { _: /\d/ },
  });

  const priceNumberRef = useMask({
    mask: "_________",
    replacement: { _: /\d/ },
  });

  const {
    register,
    setValue,
    getValues,
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
      if (!stockItemFirestoreLoaded) {
        if (param?.id) {
          setStockItemFireStroreData(await readStock(param.id));
          if (param?.quantity) {
            setStockItemQuantityModify(true);
            setStockItemBaseFormDataDisabled(true);
          }
          if (param?.scrapping) {
            setStockItemScrappingModify(true);
            setStockItemBaseFormDataDisabled(true);
          }
          if (param?.show) {
            setStockItemBaseFormDataDisabled(true);
            setShowSubmitButton(false);
          }
          if (param?.useradd) {
            setStockItemUserAdd(true);
            setStockItemBaseFormDataDisabled(true);
          }
          if (param?.userremove) {
            setStockItemUserRemove(true);
            setStockItemBaseFormDataDisabled(true);
          }
        }
        setStockItemFirestoreLoaded(true);
      }
    };
    fetchData().catch(console.error);
  }, [param?.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        !stockItemDataLoaded &&
        companyFireStroreData?.id &&
        stockItemFirestoreLoaded
      ) {
        setCompanyUid(companyFireStroreData.id);

        if (
          stockItemUserAdd ||
          stockItemQuantityModify ||
          stockItemScrappingModify ||
          stockItemBaseFormDataDisabled
        ) {
          setShowUploadFileComponent(false);
        } else {
          setShowUploadFileComponent(true);
        }
        if (stockItemFireStroreData?.id) {
          storageItemData.storageDefaultValue = {
            id: stockItemFireStroreData.storageId,
            name: stockItemFireStroreData.storageName,
          };
        }

        if (stockItemUserAdd) {
          setValue("modifiedQuantity", -1);
        } else if (stockItemUserRemove) {
          setValue("modifiedQuantity", 1);
        }

        if (!stockItemBaseFormDataDisabled && stockItemFireStroreData?.id) {
          setStockItemUnmodifiableFormDataDisabled(true);
        }
        storageItemData.allCompanyStorages = await readStorageItems(
          companyFireStroreData.id
        );
        setValue("stockItemName", stockItemFireStroreData.name);
        setValue("stockItemBarcode", stockItemFireStroreData.barcode);
        setValue("stockItemDescription", stockItemFireStroreData.description);

        console.debug(
          "sstorageItemData.allCompanyStorages",
          storageItemData.allCompanyStorages
        );

        console.debug(
          "stockItemFireStroreData.documentId",
          stockItemFireStroreData.documentId
        );
        setStockItemData({
          ...stockItemFireStroreData,
        });

        if (stockItemFireStroreData?.quantity) {
          setValue("stockItemQuantity", stockItemFireStroreData.quantity);
          stockItemData.quantity = stockItemFireStroreData.quantity;
        } else {
          setValue("stockItemQuantity", 0);
          stockItemData.quantity = 0;
        }

        console.debug("stockItemData", stockItemData);

        setStockItemDataLoaded(true);
      }
    };
    fetchData().catch(console.error);
  }, [stockItemFirestoreLoaded, companyFireStroreData]);

  useEffect(() => {
    const fetchData = async () => {
      if (stockItemDataLoaded) {
        let currentPortalLanguge = getCurrentUserLanguage();
        console.debug("currentPortalLanguge", currentPortalLanguge);
        if (!currentPortalLanguge) {
          currentPortalLanguge = portalLanguage;
        }

        let isNewStockItemData = true;
        if (stockItemFireStroreData?.id) {
          isNewStockItemData = false;
        }

        const i18nFormtextLocal = [];

        if (storageItemData.allCompanyStorages.length === 0) {
          if (currentPortalLanguge == "HU") {
            setErrorFormMessage(
              "Mielőtt berögzítene egy készlet adatot kérem rögzítsen egy raktárat "
            );
          } else {
            setErrorFormMessage(
              "Before recording stock item, please record a storage"
            );
          }
          setStockItemBaseFormDataDisabled(true);
        }

        if (currentPortalLanguge == "HU") {
          i18nFormtextLocal.stockItemStorageName = "Raktár neve:";
          i18nFormtextLocal.stockItemStorageOption =
            "Kérlek válassz egy raktárat";
          i18nFormtextLocal.stockItemName = "Készlet neve:";
          i18nFormtextLocal.stockItemNameText =
            "Kérlek add meg a készlet nevét";
          i18nFormtextLocal.stockItemBarcode = "Készlet vonalkód:";
          i18nFormtextLocal.stockItemBarcodeText =
            "Kérem adja meg a készlet vonalkódját.";
          i18nFormtextLocal.stockItemQuantity = "Mennyiség:";
          i18nFormtextLocal.stockItemQuantityText =
            "Jelenlegi készlet mennyiség.";
          i18nFormtextLocal.yes = "Igen";
          i18nFormtextLocal.no = "Nem";
          i18nFormtextLocal.stockItemDescription = "Készlet leírása:";
          i18nFormtextLocal.stockItemDescriptionText =
            "Kérem írjon egy rövid leírást a készletről.";
          i18nFormtextLocal.stockItemDocument =
            "Művelethez kapcsolódó dokument:";
          i18nFormtextLocal.stockItemPicture = "Készletről kép:";
          i18nFormtextLocal.stockItemDocumentNotSelected =
            "Nincs kiválasztva dokumentum";
        } else {
          i18nFormtextLocal.stockItemStorageName = "Storage name:";
          i18nFormtextLocal.stockItemStorageOption =
            "Please select your storage";
          i18nFormtextLocal.stockItemName = "Stock item name:";
          i18nFormtextLocal.stockItemNameText =
            "Please add the stock item name.";
          i18nFormtextLocal.stockItemBarcode = "Stock item barcode:";
          i18nFormtextLocal.stockItemBarcodeText =
            "Please add the stock item barcode.";
          i18nFormtextLocal.stockItemQuantity = "Quantity:";
          i18nFormtextLocal.stockItemQuantityText = "Current quantity.";
          i18nFormtextLocal.yes = "Yes";
          i18nFormtextLocal.no = "No";
          i18nFormtextLocal.stockItemDescription = "Stock item description:";
          i18nFormtextLocal.stockItemDescriptionText =
            "Please write a short description of stock item.";
          i18nFormtextLocal.stockItemDocument = "Stock item action document:";
          i18nFormtextLocal.stockItemPicture = "Stock item picture:";
          i18nFormtextLocal.stockItemDocumentNotSelected =
            "No document selected";
        }

        if (isNewStockItemData) {
          if (currentPortalLanguge == "HU") {
            i18nFormtextLocal.stockItemFormHeaderText =
              "Új raktári tétel létrehozása";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Raktári tétel mentése";
          } else {
            i18nFormtextLocal.stockItemFormHeaderText = "Create new stock item";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Save the new stock item data";
          }
        } else if (stockItemQuantityModify) {
          if (currentPortalLanguge == "HU") {
            i18nFormtextLocal.stockItemModifyQuantityNumber = "Mennyiség:";
            i18nFormtextLocal.stockItemModifyQuantityNumberText =
              "Kérlek add meg a mennyiséget amit hozzá szeretnél adni.";
            i18nFormtextLocal.stockItemModifyQuantityDescription = "Leírás:";
            i18nFormtextLocal.stockItemModifyQuantityDescriptionText =
              "Leírás arról, hogy miért ad hozzá új tételt";
            i18nFormtextLocal.stockItemQuantityDocument =
              "Hozzáadás kapcsán dokumentum:";
            i18nFormtextLocal.stockItemFormHeaderText = "Hozzáadás meglévőkhöz";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Az új mennyiségi érték hozzáadása és elmentése";
          } else {
            i18nFormtextLocal.stockItemModifyQuantityNumber = "Quantity add:";
            i18nFormtextLocal.stockItemModifyQuantityNumberText =
              "Enter a new quantity that you want to add.";
            i18nFormtextLocal.stockItemModifyQuantityDescription =
              "Description:";
            i18nFormtextLocal.stockItemModifyQuantityDescriptionText =
              "Description while you add the quantity";
            i18nFormtextLocal.stockItemQuantityDocument =
              "Stock item adding document:";
            i18nFormtextLocal.stockItemFormHeaderText =
              "Add new quantity to stock item";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Save the new quantity stock item data";
          }
        } else if (stockItemScrappingModify) {
          if (currentPortalLanguge == "HU") {
            i18nFormtextLocal.stockItemModifyQuantityNumber =
              "Leselejtezési darabszám:";
            i18nFormtextLocal.stockItemModifyQuantityNumberText =
              "Kérlek add meg a mennyiséget amit szeretnél leselejtezni.";
            i18nFormtextLocal.stockItemModifyQuantityDescription = "Leírás:";
            i18nFormtextLocal.stockItemModifyQuantityDescriptionText =
              "Leírás arról miért szeretné ezeket a tételeket leselejtezni";
            i18nFormtextLocal.storageItemPossibleToSell =
              "Eladható-e a termék:";
            i18nFormtextLocal.storageItemPossibleToSellText =
              "Kérem adja meg, hogy a termék eladható-e vagy sem";
            i18nFormtextLocal.stockItemQuantityDocument =
              "Leselejtezési készlet dokumentum:";
            i18nFormtextLocal.storageItemSellPrice = "Eladási ár:";
            i18nFormtextLocal.storageItemSellPriceText =
              "Kérlek add meg, hogy mennyi az eladási ár";
            i18nFormtextLocal.stockItemFormHeaderText = "Tételek leselejtezése";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "A tételek leselejtezése és elmentése";
          } else {
            i18nFormtextLocal.stockItemModifyQuantityNumber =
              "Scrapped quantity:";
            i18nFormtextLocal.stockItemModifyQuantityNumberText =
              "Enter a new quantity that you want to srapped.";
            i18nFormtextLocal.stockItemModifyQuantityDescription =
              "Description:";
            i18nFormtextLocal.stockItemModifyQuantityDescriptionText =
              "Description why did you scrap thhis stock item(s)";
            i18nFormtextLocal.stockItemQuantityDocument =
              "Stock item scrapping document:";
            i18nFormtextLocal.storageItemPossibleToSell =
              "Can the stock item be sold?:";
            i18nFormtextLocal.storageItemPossibleToSellText =
              "Please add the stock item be sold";
            i18nFormtextLocal.storageItemSellPrice = "Sale price:";
            i18nFormtextLocal.storageItemSellPriceText =
              "Please enter the selling price of the stock item";
            i18nFormtextLocal.stockItemFormHeaderText =
              "Scrapping the stock items";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Save the piece number of the stock item to be scrapped";
          }
        } else if (stockItemUserAdd) {
          if (currentPortalLanguge == "HU") {
            i18nFormtextLocal.userNameLabelText = "Felhasználó:";
            i18nFormtextLocal.userNameHelperText =
              "Akihez a készletet hozzá akarja rendelni.";
            i18nFormtextLocal.stockItemModifyQuantityNumber =
              "Ennyivel csökken a készlet:";
            i18nFormtextLocal.stockItemModifyQuantityNumberText =
              "Készlet csökkenő mennyiségen nem tudsz változtatni.";
            i18nFormtextLocal.stockItemModifyQuantityDescription = "Leírás:";
            i18nFormtextLocal.stockItemModifyQuantityDescriptionText =
              "Leírás arról miért szeretné ezeket a tételeket a felhasználóhoz adni";
            i18nFormtextLocal.stockItemQuantityDocument =
              "Kiadás készlet dokumentum:";
            i18nFormtextLocal.stockItemFormHeaderText =
              "Készlet hozzáadása a felhasználóhoz";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Kélszlet felhasználóhoz való hozzárendelés elmentése";
          } else {
            i18nFormtextLocal.userNameLabelText = "User name:";
            i18nFormtextLocal.userNameHelperText =
              "The stock item is added to this user.";
            i18nFormtextLocal.stockItemModifyQuantityNumber = "Quantity minus:";
            i18nFormtextLocal.stockItemModifyQuantityNumberText =
              "You cannot change a quantity that is decreasing in storage.";
            i18nFormtextLocal.stockItemModifyQuantityDescription =
              "Description:";
            i18nFormtextLocal.stockItemModifyQuantityDescriptionText =
              "Description why did you add to user thhis stock item";
            i18nFormtextLocal.stockItemQuantityDocument =
              "Stock item to user document:";
            i18nFormtextLocal.stockItemFormHeaderText = "Add user stock item";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Save the user stock item";
          }
        } else {
          if (currentPortalLanguge == "HU") {
            i18nFormtextLocal.stockItemFormHeaderText =
              "Meglévő készlet módosítása";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Meglévő készlet adat módosítás elmentése";
          } else {
            i18nFormtextLocal.stockItemFormHeaderText = "Modify stock item";
            i18nFormtextLocal.stockItemSubmitButtonText =
              "Modify the stock item data";
          }
        }
        setI18nFormtext(i18nFormtextLocal);
      }
    };
    fetchData().catch(console.error);
  }, [portalLanguage, stockItemDataLoaded]);

  const handleDocumentFileUpload = ({ target }) => {
    let valid = true;
    setSelectedDocumentFile(null);
    setErrorFormMessage(null);
    const updloadedFile = target.files[0];
    const acceptedFormats = ["docx", "pdf", "odt"];
    const fileExtension = updloadedFile.name.split(".").pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setErrorFormMessage("Invalid file format!");
      valid = false;
    } else if (updloadedFile.size > 1 * 1000 * 1024) {
      setErrorFormMessage("Max.file size allowed is 1MB !");
      valid = false;
    }
    if (valid) {
      stockItemData.document = URL.createObjectURL(updloadedFile);
      if (
        stockItemUserAdd ||
        stockItemQuantityModify ||
        stockItemScrappingModify
      ) {
        setSelectedQuantityDocumentFile(updloadedFile);
      } else {
        setSelectedDocumentFile(updloadedFile);
      }
    }
  };

  const handlePictureFileUpload = ({ target }) => {
    let valid = true;
    setSelectedImageFile(null);
    setErrorFormMessage(null);
    const updloadedFile = target.files[0];
    const acceptedFormats = ["jpg", "png"];
    const fileExtension = updloadedFile.name.split(".").pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setErrorFormMessage("Invalid file format!");
      valid = false;
    } else if (updloadedFile.size > 1 * 2000 * 1024) {
      setErrorFormMessage("Max.file size allowed is 2M !");
      valid = false;
    }
    if (valid) {
      stockItemData.picture = URL.createObjectURL(updloadedFile);
      setSelectedImageFile(updloadedFile);
    }
  };

  const onSubmit = async (data, e) => {
    event.preventDefault();
    setSuccessfulSaved(false);
    setErrorFormMessage(null);

    stockItemData.modifierUserUid = user.uid;
    stockItemData.modifierUserMail = user.email;
    stockItemData.companyUid = companyUid;

    console.debug("Submit on process");

    if (!stockItemFireStroreData?.id && !selectedDocumentFile) {
      setErrorFormMessage("Please select a valid document");
      throw new Error("Document error");
    }

    if (
      (stockItemQuantityModify || stockItemScrappingModify) &&
      !selectedQuantityDocumentFile
    ) {
      setErrorFormMessage("Please select a valid document");
      throw new Error("Document error");
    }

    if (!stockItemBaseFormDataDisabled) {
      if (stockItemFireStroreData?.id) {
        try {
          await modifyStockItem(
            stockItemFireStroreData.documentId,
            stockItemData
          );
          setSuccessfulSaved(true);
        } catch (error) {
          console.error("An error occurred during save!", error);
        } finally {
          console.debug("Form saved");
        }
      } else {
        createBaseFirestoreData(stockItemData, user, companyUid);
        stockItemData.quantity = 0;
        try {
          const stockItemDataSaved = await addNewStockItem(stockItemData);
          stockItemQuantityData.stockItemDocumentId =
            stockItemFireStroreData.documentId;

          stockItemQuantityData.reason = "NEW";
          stockItemQuantityData.modifiedQuantity = 0;

          setShowSubmitButton(false);
          setStockItemBaseFormDataDisabled(true);

          setSuccessfulSaved(true);
        } catch (error) {
          console.error("An error occurred during save!", error);
        } finally {
        }
      }
    }

    if (
      stockItemQuantityModify ||
      stockItemScrappingModify ||
      stockItemUserAdd
    ) {
      stockItemQuantityData.stockItemDocumentId =
      stockItemFireStroreData.documentId;
    }

    if (
      !stockItemFireStroreData?.id ||
      stockItemQuantityModify ||
      stockItemScrappingModify ||
      stockItemUserAdd
    ) {
      if (stockItemUserAdd || stockItemUserRemove) {
        stockItemQuantityData.modifiedQuantity = getValues("modifiedQuantity");
      }

      createBaseFirestoreData(stockItemQuantityData, user, companyUid);
      stockItemQuantityData.name = stockItemData.name;
      if (selectedDocumentFile) {
        stockItemQuantityData.documentURL =
          await uploadDocument(selectedDocumentFile);
      } else {
        stockItemQuantityData.documentURL = "";
      }
      if (selectedImageFile) {
        stockItemQuantityData.imageURL = await uploadDocument(
          selectedImageFile,
          "images"
        );
      } else {
        stockItemQuantityData.imageURL = "";
      }
      if (selectedQuantityDocumentFile) {
        stockItemQuantityData.documentURL = await uploadDocument(
          selectedQuantityDocumentFile
        );
      } else {
        stockItemQuantityData.documentURL = "";
      }
      try {
        let newQuantity;
        if (stockItemScrappingModify) {
          stockItemQuantityData.modifiedQuantity *= -1;
        }
        if (
          stockItemQuantityModify ||
          stockItemUserAdd ||
          stockItemUserRemove ||
          stockItemScrappingModify
        ) {
          newQuantity =
            stockItemData.quantity * 1 +
            stockItemQuantityData.modifiedQuantity * 1;
        }
        if (newQuantity < 0) {
          setErrorFormMessage("Sorry, not possible negative quantity number");
          throw new Error("Negative number error");
        }

        if (
          stockItemQuantityModify ||
          stockItemScrappingModify ||
          stockItemUserAdd
        ) {
          await modifyStockItemQuantity(
            stockItemFireStroreData.documentId,
            newQuantity
          );
          setValue("stockItemQuantity", newQuantity);
        }

        if (stockItemQuantityModify) {
          stockItemQuantityData.reason = "ADDED";
        } else if (stockItemScrappingModify) {
          stockItemQuantityData.reason = "SCRAPPING";
        } else if (stockItemUserAdd) {
          stockItemQuantityData.reason = "USERADD";
        } else if (stockItemUserRemove) {
          stockItemQuantityData.reason = "USERREMOVE";
        }

        console.debug("stockItemQuantityData", stockItemQuantityData);

        if (stockItemScrappingModify && stockItemsSalableData.price > 0) {
          createBaseFirestoreData(stockItemsSalableData, user, companyUid);
          stockItemsSalableData.stockItemUserUid = user.uid;
          stockItemsSalableData.stockItemUserEmail = user.email;
          stockItemsSalableData.name = stockItemData.name;
          stockItemsSalableData.stockItemDocumentId =
            stockItemFireStroreData.documentId;
          createStockItemSalable(stockItemsSalableData);
        }

        await createStockItemModifiedQuantity(stockItemQuantityData);

        setValue("modifiedQuantity", null);
        setValue("stockItemQuantityDescription", null);

        if (stockItemUserAdd) {
          let stockItemUSerData = [];
          createBaseFirestoreData(stockItemUSerData, user, companyUid);
          stockItemUSerData.stockItemUserUid = user.uid;
          stockItemUSerData.stockItemUserEmail = user.email;
          stockItemUSerData.name = stockItemData.name;
          stockItemUSerData.stockItemDocumentId =
            stockItemFireStroreData.documentId;
          stockItemUSerData.removed = 0;
          await addNewUserStockItem(stockItemUSerData);
        }
        if (stockItemUserRemove) {
          let stockItemUSerData = readUserStockItem(
            stockItemFireStroreData.documentId,
            creatorUserUid
          );
          stockItemUSerData.removed = 1;
          await modifyUserStockItem(stockItemUSerData);
        }
        setSuccessfulSaved(true);
        setSelectedImageFile(null);
        setSelectedDocumentFile(null);
        setSelectedQuantityDocumentFile(null);
        setShowSubmitButton(false);
        setStockItemBaseFormDataDisabled(true);
      } catch (error) {
        console.error("An error occurred during save!", error);
      } finally {
        console.debug("Form saved");
      }
    }
  };

  const handleStorageInputChange = (event, value) => {
    if (value) {
      console.debug("handleStorageInputChange value", value.id);
      setStockItemData({
        ...stockItemData,
        storageId: value.id,
        storageName: value.name,
      });
    }
  };

  return (
    <main>
      <div id="addModifyStockDIV">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <h2>{i18nFormtext["stockItemFormHeaderText"]}</h2>
          {errorFormMessage && (
            <ErrorOnForm errorFormMessage={errorFormMessage}></ErrorOnForm>
          )}
          {successfulSaved && <SuccessFulSave></SuccessFulSave>}

          {(stockItemUserAdd || stockItemUserRemove) && stockItemDataLoaded && (
            <UserDisplayForm
              user={user}
              userNameLabelText={i18nFormtext["userNameLabelText"]}
              userNameHelperText={i18nFormtext["userNameHelperText"]}
            />
          )}

          {(stockItemQuantityModify ||
            stockItemScrappingModify ||
            stockItemUserAdd) &&
            stockItemDataLoaded && (
              <Grid>
                <Grid container alignItems="left" paddingTop={2}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={2}>
                    <InputLabel htmlFor="stockItemQuantityAdd">
                      {i18nFormtext["stockItemModifyQuantityNumber"]}
                    </InputLabel>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      {...register("modifiedQuantity", {
                        required: true,
                      })}
                      inputRef={addQuantityNumberRef}
                      required
                      fullWidth
                      id="stockItemQuantityAdd"
                      disabled={stockItemUserAdd || stockItemUserRemove}
                      onChange={(event) => {
                        setStockItemQuantityData({
                          ...stockItemQuantityData,
                          modifiedQuantity: event.target.value,
                        });
                      }}
                      helperText={
                        i18nFormtext["stockItemModifyQuantityNumberText"]
                      }
                      error={stockItemQuantityData.modifiedQuantity === ""}
                    />
                  </Grid>
                </Grid>
                <Grid container alignItems="left" paddingTop={2}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={2}>
                    <InputLabel htmlFor="stockItemQuantityDescription">
                      {i18nFormtext["stockItemModifyQuantityDescription"]}
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextareaAutosize
                      {...register("stockItemQuantityDescription", {
                        required: true,
                      })}
                      id="stockItemQuantityDescription"
                      required
                      aria-describedby="stockItemQuantityDescriptionText"
                      onChange={(e) =>
                        setStockItemQuantityData({
                          ...stockItemQuantityData,
                          description: e.target.value,
                        })
                      }
                    />
                    <FormHelperText id="stockItemQuantityDescriptionText">
                      {i18nFormtext["stockItemModifyQuantityDescriptionText"]}
                    </FormHelperText>
                  </Grid>
                </Grid>

                {stockItemScrappingModify && (
                  <Grid container alignItems="left">
                    <Grid item xs={1}></Grid>
                    <Grid item xs={2}>
                      <FormLabel id="storageItemPossibleToSell">
                        {i18nFormtext["storageItemPossibleToSell"]}
                      </FormLabel>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl>
                        <RadioGroup
                          defaultValue={storageItemData.virual}
                          name="storageItemPossibleToSell"
                          orientation="horizontal"
                          row={true}
                          {...register("storageItemPossibleToSell")}
                          disabled={false}
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
                              setStockItemIssSalable(e.target.value)
                            }
                            disabled={false}
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
                              setStockItemIssSalable(e.target.value)
                            }
                            disabled={false}
                          />
                        </RadioGroup>
                      </FormControl>
                      <FormHelperText id="storageItemPossibleToSellText">
                        {i18nFormtext["storageItemPossibleToSellText"]}
                      </FormHelperText>
                    </Grid>

                    <Grid container alignItems="left" paddingTop={2}>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={2}>
                        <InputLabel htmlFor="stockItemSalePrice">
                          {i18nFormtext["storageItemSellPrice"]}
                        </InputLabel>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          {...register("stockItemSalePrice", {
                            required: false,
                          })}
                          inputRef={priceNumberRef}
                          fullWidth
                          id="stockItemSalePrice"
                          aria-describedby="stockItemSalePriceText"
                          disabled={stockItemIssSalable === "no"}
                          required={stockItemIssSalable === "yes"}
                          onChange={(event) =>
                            setStockItemsSalableData({
                              ...stockItemsSalableData,
                              price: event.target.value,
                            })
                          }
                          helperText={i18nFormtext["storageItemSellPriceText"]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                <Grid container alignItems="left" paddingTop={2}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={2}>
                    <InputLabel>
                      {i18nFormtext["stockItemQuantityDocument"]}
                    </InputLabel>
                  </Grid>
                  <Grid>
                    <input
                      {...register("selectedQuantityDocumentFile", {
                        required: true,
                      })}
                      id="stockItemQuantityDocument"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleDocumentFileUpload}
                      required
                    />
                  </Grid>
                  <Grid item>
                    <InputLabel>
                      {selectedQuantityDocumentFile
                        ? selectedQuantityDocumentFile.name
                        : i18nFormtext["stockItemQuantityDocumentNotSelected"]}
                    </InputLabel>
                  </Grid>
                  <Grid item>
                    <Box marginTop={-2}>
                      <Tooltip title="Select a quantity document while to add new quantity">
                        <label
                          id="uploadFileTooltip"
                          htmlFor="stockItemQuantityDocument"
                        >
                          <UploadFileRounded
                            color="primary"
                            aria-label="upload document"
                            fontSize="large"
                          ></UploadFileRounded>
                        </label>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            )}

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="stockItemStorageName">
                {i18nFormtext["stockItemStorageName"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                id="stockItemStorageName"
                options={storageItemData.allCompanyStorages}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => (option.name ? option.name : "")}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={i18nFormtext["stockItemStorageOption"]}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
                key={storageItemData.storageDefaultValue}
                defaultValue={storageItemData.storageDefaultValue}
                onChange={handleStorageInputChange}
                disabled={
                  stockItemBaseFormDataDisabled ||
                  stockItemUnmodifiableFormDataDisabled
                }
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="stockItemName">
                {i18nFormtext["stockItemName"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register("stockItemName", { required: true })}
                fullWidth
                id="stockItemName"
                aria-describedby="stockItemNameText"
                required
                onChange={(event) =>
                  setStockItemData({
                    ...stockItemData,
                    name: event.target.value,
                  })
                }
                disabled={
                  stockItemBaseFormDataDisabled ||
                  stockItemUnmodifiableFormDataDisabled
                }
                helperText={i18nFormtext["stockItemNameText"]}
                error={
                  !(
                    stockItemBaseFormDataDisabled ||
                    stockItemUnmodifiableFormDataDisabled
                  ) && stockItemData.name === ""
                }
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left">
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="stockItemBarcode">
                {i18nFormtext["stockItemBarcode"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register("stockItemBarcode", { required: true })}
                fullWidth
                id="stockItemBarcode"
                aria-describedby="stockItemBarcodeText"
                required
                onChange={(event) =>
                  setStockItemData({
                    ...stockItemData,
                    barcode: event.target.value,
                  })
                }
                disabled={
                  stockItemBaseFormDataDisabled ||
                  stockItemUnmodifiableFormDataDisabled
                }
                error={stockItemData.barcode === ""}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="stockItemQuantity">
                {i18nFormtext["stockItemQuantity"]}
              </InputLabel>
            </Grid>
            <Grid item xs={4}>
              <TextField
                {...register("stockItemQuantity", { required: false })}
                fullWidth
                id="stockItemQuantity"
                aria-describedby="stockItemQuantityText"
                disabled={true}
                helperText={i18nFormtext["stockItemQuantityText"]}
              />
            </Grid>
          </Grid>

          <Grid container alignItems="left" paddingTop={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <InputLabel htmlFor="stockItemDescription">
                {i18nFormtext["stockItemDescription"]}
              </InputLabel>
            </Grid>
            <Grid item xs={6}>
              <TextareaAutosize
                {...register("stockItemDescription", { required: true })}
                id="stockItemDescription"
                aria-describedby="stockItemDescriptionText"
                onChange={(e) => (stockItemData.description = e.target.value)}
                disabled={stockItemBaseFormDataDisabled}
                readOnly={stockItemBaseFormDataDisabled}
              />
              <FormHelperText id="stockItemDescriptionText">
                {i18nFormtext["stockItemDescriptionText"]}
              </FormHelperText>
            </Grid>
          </Grid>

          {showUploadFileComponent && (
            <Grid>
              <Grid container alignItems="left" paddingTop={2}>
                <Grid item xs={1}></Grid>
                <Grid item xs={2}>
                  <InputLabel>{i18nFormtext["stockItemDocument"]}</InputLabel>
                </Grid>
                <Grid>
                  <input
                    {...register("selectedDocumentFile", {
                      required: true,
                    })}
                    id="stockItemDocument"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleDocumentFileUpload}
                    required
                  />
                </Grid>
                <Grid item>
                  <InputLabel>
                    {selectedDocumentFile
                      ? selectedDocumentFile.name
                      : i18nFormtext["stockItemDocumentNotSelected"]}
                  </InputLabel>
                </Grid>
                <Grid item>
                  <Box marginTop={-2}>
                    <Tooltip title="Select a quantity document while to add new quantity">
                      <label id="uploadFileTooltip" htmlFor="stockItemDocument">
                        <UploadFileRounded
                          color="primary"
                          aria-label="upload document"
                          fontSize="large"
                        ></UploadFileRounded>
                      </label>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
              <Grid container alignItems="left" paddingTop={2}>
                <Grid item xs={1}></Grid>
                <Grid item xs={2}>
                  <InputLabel>{i18nFormtext["stockItemPicture"]}</InputLabel>
                </Grid>
                <Grid>
                  <input
                    {...register("selectedImageFile", {
                      required: true,
                    })}
                    id="stockItemPicture"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handlePictureFileUpload}
                    required
                  />
                </Grid>
                <Grid item>
                  <InputLabel>
                    {selectedImageFile
                      ? selectedImageFile.name
                      : i18nFormtext["stockItemDocumentNotSelected"]}
                  </InputLabel>
                </Grid>
                <Grid item>
                  <Box marginTop={-2}>
                    <Tooltip title="Select a quantity document while to add new quantity">
                      <label id="uploadFileTooltip" htmlFor="stockItemPicture">
                        <ImageRoundedIcon
                          color="secondary"
                          aria-label="upload document"
                          fontSize="large"
                        ></ImageRoundedIcon>
                      </label>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          )}

          {showSubmitButton && (
            <Grid container alignItems="center" paddingTop={2}>
              <Grid item xs={7} alignItems={"center"}>
                <Button color="primary" type="submit">
                  {i18nFormtext["stockItemSubmitButtonText"]}
                </Button>
              </Grid>
            </Grid>
          )}
        </form>
      </div>
    </main>
  );
};
