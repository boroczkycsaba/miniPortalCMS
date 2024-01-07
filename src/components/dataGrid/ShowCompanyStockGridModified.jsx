import React from "react";
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

export const ShowCompanyStockGridModified = ({
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
        setStockListFirestore(await readModifiedStocks(companyFireStroreData.id));
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
      field: "modifiedQuantity",
      headerName: "Modified quantity",
      width: 150,
      editable: false,
    },
    {
      field: "reason",
      headerName: "Reason",
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
