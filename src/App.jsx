import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { PwReset } from "./pages/PwReset";
import { Register } from "./pages/Register";
import { DashBoard } from "./pages/DashBoard";
import { ManageMyCompany } from "./pages/company/ManageMyCompany";
import { ManageCompanyStock } from "./pages/stock/ManageCompanyStock";
import { UserProvider } from "./context/UserContext";
import { useState } from "react";
import { AddModifyStock } from "./pages/stock/AddModifyStock";
import { ShowCompanyStockModified } from "./pages/stock/ShowCompanyStockModified";
import { ManageStockStorage } from "./pages/stockStorage/ManageStockStorage";
import { AddModifyStockStorage } from "./pages/stockStorage/AddModifyStockStorage";
import { ShowSalableStockItems } from "./pages/sales/ShowSalableStockItems";

const queryClient = new QueryClient();

function App() {
  const [companyFireStroreData, setCompanyFireStroreData] = useState([]);
  const [portalLanguage, setPortalLanguage] = useState([]);

  return (
    <BrowserRouter>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <div className="page">
            <Header
              portalLanguage={portalLanguage}
              setPortalLanguage={setPortalLanguage}
            />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pwreset" element={<PwReset />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/portal/dashboard"
                element={
                  <DashBoard
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/company/manage"
                element={
                  <ManageMyCompany
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />

              <Route
                path="/portal/storageItem/list"
                element={
                  <ManageStockStorage
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />

              <Route
                path="/portal/storageItem/new"
                element={
                  <AddModifyStockStorage
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/itemStorage/show/:id/:show"
                element={
                  <AddModifyStockStorage
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                  />
                }
              />
              <Route
                path="/portal/itemStorage/modify/:id"
                element={
                  <AddModifyStockStorage
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />

              <Route
                path="/portal/item/list"
                element={
                  <ManageCompanyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/item/new"
                element={
                  <AddModifyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/item/modify/:id"
                element={
                  <AddModifyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/item/show/:id/:show"
                element={
                  <AddModifyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/item/modified/show"
                element={
                  <ShowCompanyStockModified
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/item/quantity/:id/:quantity"
                element={
                  <AddModifyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/item/scrapping/:id/:scrapping"
                element={
                  <AddModifyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/user/item/add/:id/:useradd"
                element={
                  <AddModifyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
              <Route
                path="/portal/user/item/remove/:id/:userStockItemId/:userremove"
                element={
                  <AddModifyStock
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />
               <Route
                path="/portal/item/salable/show"
                element={
                  <ShowSalableStockItems
                    companyFireStroreData={companyFireStroreData}
                    setCompanyFireStroreData={setCompanyFireStroreData}
                    portalLanguage={portalLanguage}
                  />
                }
              />           
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </QueryClientProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
