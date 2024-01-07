import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import { useEffect } from 'react';
import "../../stylesheets/sales/ShowSalableStockItems.css";
import { ShowSalableStockItemsGrid } from '../../components/dataGrid/ShowSalableStockItemsGrid';

export const ShowSalableStockItems  = ({
  companyFireStroreData,
  setCompanyFireStroreData,
  portalLanguage,
}) => {
  const { user } = useContext(UserContext);
  const [creatorUserUid, setCreatorUserUid] = useState("");

  useEffect(() => {
    if (user && user.uid) setCreatorUserUid(user.uid);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (creatorUserUid && !companyFireStroreData?.id) {
        setCompanyFireStroreData(await readCompany(creatorUserUid));
      }
    };
    fetchData().catch(console.error);
  }, [creatorUserUid]);

  return (
    <main>
      <div id="showSalableStockDIV">
      {
        <ShowSalableStockItemsGrid
          companyFireStroreData={companyFireStroreData}
          setCompanyFireStroreData={setCompanyFireStroreData}
          portalLanguage={portalLanguage}
        ></ShowSalableStockItemsGrid>
      }
      </div>
    </main>
  )
}
