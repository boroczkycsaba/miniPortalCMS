import React from "react";
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

export const ManageCompanyStorageStockGrid = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage,
}) => {
  const { user } = useContext(UserContext);
  const [creatorUserUid, setCreatorUserUid] = useState("");

  const [stockFirestoreLoaded, setStockFirestoreLoaded] = useState(false);
  const [stockListFirestore, setStockListFirestore] = useState([]);

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

  const columns = [
    {
      field: "name",
      headerName: "Storage item name",
      width: 200,
      editable: false,
    },
    {
      field: "virtual",
      headerName: "Is virtual?",
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
      headerName: "Address",
      width: 250,
      editable: false,
    },
    {
      field: "description",
      headerName: "Description",
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
              Swow storage
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={onClickEdit}
            >
              Modify
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
