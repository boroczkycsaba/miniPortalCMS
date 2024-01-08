import React from "react";
import langugeData from "../../languages/stock/ManageCompanyStock.json";
import { BaseDataGrid } from "./BaseDataGrid";
import { readStocks } from "../../utility/crudUtilityStock";
import { Loader } from "../Loader";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { readCompany } from "../../utility/crudUtilityCompany";
import { useNavigate } from "react-router-dom";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage";

export const ManageCompanyStockGrid = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage,
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
      if (companyFireStroreData?.id) {
        setStockListFirestore(await readStocks(companyFireStroreData.id));
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
      field: "quantity",
      headerName: i18nFormtext["currentQuantity"],
      width: 100,
      editable: false,
    },
    {
      field: "aviable",
      headerName: i18nFormtext["scrapped"],
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
      width: 500,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClickEdit = (e) => {
          const currentRowId = params.row.documentId;
          navigate("/portal/item/modify/" + currentRowId);
        };
        const onClickScrapping = (e) => {
          const currentRowId = params.row.documentId;
          navigate("/portal/item/scrapping/" + currentRowId + "/y");
        };
        const onClickQuantity = (e) => {
          const currentRowId = params.row.documentId;
          navigate("/portal/item/quantity/" + currentRowId + "/y");
        };
        const onClickUser = (e) => {
          const currentRowId = params.row.documentId;
          navigate("/portal/user/item/add/" + currentRowId + "/y");
        };

        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onClickEdit}
            >
              {i18nFormtext["stockItemModify"]}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={onClickQuantity}
            >
              {i18nFormtext["stockItemAddQuantity"]}
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onClickScrapping}
            >
              {i18nFormtext["stockItemScrapping"]}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={onClickUser}
            >
              {i18nFormtext["stockItemUser"]}
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
        <BaseDataGrid
          fireStoreListData={stockListFirestore}
          columns={columns}
        ></BaseDataGrid>
      )}
    </div>
  );
};
