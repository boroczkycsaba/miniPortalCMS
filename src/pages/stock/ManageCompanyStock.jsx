import React from "react";
import { Button, Stack } from "@mui/material";
import { ManageCompanyStockGrid } from "../../components/dataGrid/ManageCompanyStockGrid.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUserLanguage } from "../../utility/serviceLanguage.js";
import { useState } from "react";
import "../../stylesheets/stock/ManageCompanyStock.css";

export const ManageCompanyStock = ({
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
    navigate("/portal/item/new");
  };

  return (
    <main>
      <div id="manageCompanyStockDIV">
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
          <ManageCompanyStockGrid
            companyFireStroreData={companyFireStroreData}
            setCompanyFireStroreData={setCompanyFireStroreData}
          ></ManageCompanyStockGrid>
        }
      </div>
    </main>
  );
};
