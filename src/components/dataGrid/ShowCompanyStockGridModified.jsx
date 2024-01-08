import React from "react";
import langugeData from "../../languages/stock/ShowCompanyStockModified.json";
import { BaseDataGrid } from "./BaseDataGrid";
import { readModifiedStocks } from "../../utility/crudUtilityStockQuantity";
import { Loader } from "../Loader";
import { useState } from "react";
import { useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { readCompany } from "../../utility/crudUtilityCompany";
import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage";

export const ShowCompanyStockGridModified = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage
}) => {
  const { user } = useContext(UserContext);
  const [creatorUserUid, setCreatorUserUid] = useState("");

  const [stockFirestoreLoaded, setStockFirestoreLoaded] = useState(false);
  const [stockListFirestore, setStockListFirestore] = useState([]);

  const [i18nFormtext, setI18nFormtext] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.uid) setCreatorUserUid(user.uid);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyFireStroreData?.id && creatorUserUid) {
        setCompanyFireStroreData(await readCompany(creatorUserUid));       
      }
    };
    fetchData().catch(console.error);
  }, [creatorUserUid]);

  useEffect(() => {
    const fetchData = async () => {
      if (!stockFirestoreLoaded && companyFireStroreData?.id) {
        setStockListFirestore(await readModifiedStocks(companyFireStroreData.id));
        setStockFirestoreLoaded(true);
      } else if (companyFireStroreData === undefined) {
        setStockFirestoreLoaded(true);
      }
    };
    fetchData().catch(console.error);
  }, [companyFireStroreData?.id]);

  useEffect(() => {
    if (stockFirestoreLoaded) {
      let savedPortalLanguage = getCurrentUserLanguage();
      
      if (savedPortalLanguage == "HU") {
        setI18nFormtext(langugeData["HU"]);
      } else {
        setI18nFormtext(langugeData["UK"]);
      }
    }
  }, [portalLanguage, stockFirestoreLoaded]);


  const columns = [
    {
      field: "name",
      headerName: i18nFormtext["stockName"],
      width: 200,
      editable: false,
    },
    {
      field: "modifiedQuantity",
      headerName: i18nFormtext["modifiedQuantity"],
      width: 150,
      editable: false,
    },
    {
      field: "reason",
      headerName: i18nFormtext["reason"],
      width: 100,
      editable: false,
    },
    {
      field: "description",
      headerName: i18nFormtext["description"],
      width: 300,
      editable: false,
    },
    {
      field: "action",
      headerName: i18nFormtext["action"],
      width: 200,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClickShow = (e) => {
          const currentRowId = params.row.stockItemDocumentId;
          navigate("/portal/item/show/" + currentRowId + "/y");
        };

        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onClickShow}
            >
              {i18nFormtext["swowStockdata"]}
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <div>
      {!stockFirestoreLoaded && <Loader />}
      {stockFirestoreLoaded && (
        <BaseDataGrid fireStoreListData={stockListFirestore} columns={columns}></BaseDataGrid>
      )}
    </div>
  );
};
