import React from "react";

import { ShowCompanyStockGridModified } from "../../components/dataGrid/ShowCompanyStockGridModified";
import "../../stylesheets/stock/ShowCompanyStockModified.css";

export const ShowCompanyStockModified = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage
}) => {

  return (
    <main>
      <div id="showModifiedStockDIV">
      {
        <ShowCompanyStockGridModified
          companyFireStroreData={companyFireStroreData}
          setCompanyFireStroreData={setCompanyFireStroreData}
          portalLanguage={portalLanguage}
        ></ShowCompanyStockGridModified>
      }
      </div>
    </main>
  );
};
