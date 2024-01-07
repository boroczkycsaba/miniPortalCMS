import React from 'react'
import { DashBoardGrid } from '../components/dataGrid/DashBoardGrid';
import "./DashBoard.css";

export const DashBoard = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage
}) => {

  return (
    <main>
      <div id="dashBoardDIV">
      {
        <DashBoardGrid
          companyFireStroreData={companyFireStroreData}
          setCompanyFireStroreData={setCompanyFireStroreData}
          portalLanguage={portalLanguage}
        ></DashBoardGrid>
      }
      </div>
    </main>
  );
};


