import React from "react";
import "../../stylesheets/stockStorage/ManageStockStorage.css";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ManageCompanyStorageStockGrid } from "../../components/dataGrid/ManageCompanyStorageStockGrid.jsx";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage.js";
import { useState } from "react";
import { useEffect } from "react";

export const ManageStockStorage = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage,
}) => {
  const [i18nFormtext, setI18nFormtext] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let currentPortalLanguge = getCurrentUserLanguage();
      console.debug("currentPortalLanguge", currentPortalLanguge);
      if (!currentPortalLanguge) {
        currentPortalLanguge = portalLanguage;
      }
      const i18nFormtextLocal = [];
      if (currentPortalLanguge == "HU") {
        i18nFormtextLocal.newStockItemButton = "Új készlet adat felvétele";
      } else {
        i18nFormtextLocal.newStockItemButton = "New stock item data";
      }
      setI18nFormtext(i18nFormtextLocal);
    };
    fetchData().catch(console.error);
  }, [portalLanguage]);

  const handleNewStockClick = (e) => {
    navigate("/portal/storageItem/new");
  };

  return (
    <main>
      <div id="manageStockStorageDIV">
        <div>
          <Stack
            direction="row"
            paddingBottom={2}
            paddingTop={1}
            paddingLeft={3}
            spacing={1}
          >
            <Button variant="outlined" onClick={() => handleNewStockClick()}>
              {i18nFormtext["newStockItemButton"]}
            </Button>
          </Stack>
        </div>
        {
          <ManageCompanyStorageStockGrid
            companyFireStroreData={companyFireStroreData}
            setCompanyFireStroreData={setCompanyFireStroreData}
          ></ManageCompanyStorageStockGrid>
        }
      </div>
    </main>
  );
};
