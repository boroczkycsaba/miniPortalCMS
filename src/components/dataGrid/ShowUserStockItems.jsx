import React from "react";
import { Loader } from "../Loader";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Stack } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { readCompany } from "../../utility/crudUtilityCompany";
import { useNavigate } from "react-router-dom";
import { readCompanyUserStockItems } from "../../utility/crudUtilityUserStock";
import { BlockIcon } from '@mui/icons-material/Block';
import { CheckCircleOutlineIcon } from '@mui/icons-material/CheckCircleOutline';

export const ShowUserStockItems = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage
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
        setStockListFirestore(await readCompanyUserStockItems(companyFireStroreData.id));
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
      field: "removed",
      headerName: "Have user?",
      width: 300,
      editable: false,
      renderCell: (params) => {
        return params.value ? (
          <BlockIcon
            style={{
              color: theme.palette.error.light,
            }}
          />
        ) : (
          <CheckCircleOutlineIcon
            style={{
              color: theme.palette.success.light,
            }}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
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
              Swow stock item data
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
