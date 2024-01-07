import React from "react";
import { BaseDataGrid } from "./BaseDataGrid";
import { Loader } from "../Loader";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { readCompany } from "../../utility/crudUtilityCompany";
import { useNavigate } from "react-router-dom";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage.js";
import {
  readCompanyOneUserStockItems,
} from "../../utility/crudUtilityUserStock";

export const DashBoardGrid = ({
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
    const fetchData = async () => {
      let currentPortalLanguge = getCurrentUserLanguage();
      if (!currentPortalLanguge) {
        currentPortalLanguge = portalLanguage;
      }
      const i18nFormtextLocal = [];
      if (currentPortalLanguge == "HU") {
        i18nFormtextLocal.dashBoardUserStockItemHeader = "Nálam lévő készletek";
        i18nFormtextLocal.showStockItemButton = "Készlet adat megnézése";
      } else {
        i18nFormtextLocal.dashBoardUserStockItemHeader = "My stock items";
        i18nFormtextLocal.showStockItemButton = "Swow stock item data";
      }
      setI18nFormtext(i18nFormtextLocal);
    };
    fetchData().catch(console.error);
  }, [portalLanguage]);

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
        setStockListFirestore(
          await readCompanyOneUserStockItems(
            companyFireStroreData.id,
            creatorUserUid
          )
        );
        setStockFirestoreLoaded(true);
      } else if (companyFireStroreData === undefined) {
        setStockFirestoreLoaded(true);
      }
    };
    fetchData().catch(console.error);
  }, [companyFireStroreData?.id]);

  const columns = [
    {
      field: "name",
      headerName: "Stock name",
      width: 200,
      editable: false,
    },
    {
      field: "stockItemUserEmail",
      headerName: "User name",
      width: 300,
      editable: false,
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
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
              {i18nFormtext["showStockItemButton"]}
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <div>
      <h2>{i18nFormtext["dashBoardUserStockItemHeader"]}</h2>
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
