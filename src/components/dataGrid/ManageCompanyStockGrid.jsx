import React from "react";
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

export const ManageCompanyStockGrid = ({
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
      if (companyFireStroreData?.id) {
        setStockListFirestore(await readStocks(companyFireStroreData.id));
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
      field: "quantity",
      headerName: "Quantity",
      width: 100,
      editable: false,
    },
    {
      field: "aviable",
      headerName: "Scrapped",
      width: 100,
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
      width: 400,
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
              Modify
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={onClickQuantity}
            >
              Add quantity
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onClickScrapping}
            >
              Scrapping
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={onClickUser}
            >
              User
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
