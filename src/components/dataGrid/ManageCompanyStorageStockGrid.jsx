import React from "react";
import langugeData from "../../languages/stockStorage/ManageStockStorage.json";
import { BaseDataGrid } from "./BaseDataGrid";
import { readStorageItems } from "../../utility/crudUtilityStockStorage";
import { Loader } from "../Loader";
import { useState } from "react";
import { useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { readCompany } from "../../utility/crudUtilityCompany";
import { useNavigate } from "react-router-dom";
import { Button, Stack, SvgIcon } from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage";

export const ManageCompanyStorageStockGrid = ({
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
      if (!stockFirestoreLoaded && companyFireStroreData?.id) {
        setStockListFirestore(await readStorageItems(companyFireStroreData.id));
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
      headerName: i18nFormtext["storageName"],
      width: 200,
      editable: false,
    },
    {
      field: "virtual",
      headerName: i18nFormtext["virtual"],
      width: 100,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.virtual === "yes" ? (
              <DoneOutlineIcon />
            ) : (
              <NotInterestedIcon />
            )}
          </>
        );
      },
    },
    {
      field: "address",
      headerName: i18nFormtext["address"],
      width: 250,
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
      width: 350,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClickShow = (e) => {
          const currentRowId = params.row.documentId;
          navigate("/portal/itemStorage/show/" + currentRowId + "/y");
        };
        const onClickEdit = (e) => {
          const currentRowId = params.row.documentId;
          navigate("/portal/itemStorage/modify/" + currentRowId);
        };

        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onClickShow}
            >
              {i18nFormtext["showStorageAction"]}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onClickEdit}
            >
              {i18nFormtext["modifyAction"]}
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
