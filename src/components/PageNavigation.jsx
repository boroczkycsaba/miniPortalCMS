import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { useEffect } from "react";
import { Stack } from "@mui/material";
import {
  getCurrentUserLanguage,
  saveCurrentUserLanguage,
} from "../utility/serviceLanguage";

const pages = [
  { path: "about", name: "About" },
  { path: "contact", name: "Contact" },
];


const pagesHu = [
  { path: "about", name: "Leírás" },
  { path: "contact", name: "Kapcsolat" },
];

const PageNavigation = ({ portalLanguage, setPortalLanguage }) => {
  const { user, logoutUser } = useContext(UserContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [navPages, setNavPages] = useState(pages);
  const [currentActiveLanguageElement, setCurrentActiveLanguageElement] =
    useState("");
  const [i18nFormtext, setI18nFormtext] = useState([]);

  useEffect(() => {
    let currentPortalLanguage = getCurrentUserLanguage();
    if (!currentPortalLanguage) {
      currentPortalLanguage = "HU";
      setPortalLanguage(currentPortalLanguage);
      saveCurrentUserLanguage(currentPortalLanguage);
    }
    setCurrentActiveLanguageElement("languageButton" + currentPortalLanguage);
    const i18nFormtextLocal = [];
    if (currentPortalLanguage === "HU") {
      i18nFormtextLocal.menuManageCompany = "Cég kezelése";
      i18nFormtextLocal.menuListStorageItems = "Raktárak megjelenítése";
      i18nFormtextLocal.menuListStockItem = "Készletek megjelenítése";
      i18nFormtextLocal.menuShowModificationsOfStockItems =
        "Készlet adatok módosításai";
      i18nFormtextLocal.menuShowSalableStockItems =
        "Eladható készlet megjelenítése";
      i18nFormtextLocal.Contact = "Kapcsolat";
      i18nFormtextLocal.About = "Leírás";
    } else {
      i18nFormtextLocal.menuManageCompany = "Manage company";
      i18nFormtextLocal.menuListStorageItems = "List storage items";
      i18nFormtextLocal.menuListStockItem = "List stock item";
      i18nFormtextLocal.menuShowModificationsOfStockItems =
        "Show modifications of stock items";
      i18nFormtextLocal.menuShowSalableStockItems = "Show salable stock items";
      i18nFormtextLocal.menuContact = "Contact";
      i18nFormtextLocal.menuAbout = "About";
    }
    setI18nFormtext(i18nFormtextLocal);
  }, [portalLanguage]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("miniPortalLoggedIn");
    if (isLoggedIn == "yes") {
      if (user && i18nFormtext["menuManageCompany"]) {
        const basePages = getCurrentUserLanguage() === "HU" ? pagesHu : pages;
        setNavPages([
          {
            path: "/portal/company/manage",
            name: i18nFormtext["menuManageCompany"],
          },
          {
            path: "/portal/storageItem/list",
            name: i18nFormtext["menuListStorageItems"],
          },
          {
            path: "/portal/item/list",
            name: i18nFormtext["menuListStockItem"],
          },
          {
            path: "/portal/item/modified/show",
            name: i18nFormtext["menuShowModificationsOfStockItems"],
          },
          {
            path: "/portal/item/salable/show",
            name: i18nFormtext["menuShowSalableStockItems"],
          },
          ...basePages
        ]);
      }
    } else {
      setNavPages([...pages]);
    }
  }, [user, i18nFormtext]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleChangeLanguge = (event, language) => {
    console.debug("language", language);
    saveCurrentUserLanguage(language);
    setPortalLanguage(language);
    setCurrentActiveLanguageElement("languageButton" + language);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="x5">
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="a"
            href="/portal/dashboard"
            key="dashboard"
            sx={{
              mr: 5,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            🗄️
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              key="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {navPages.map((obj) => (
                <NavLink
                  key={obj.name}
                  to={obj.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{obj.name}</Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navPages.map((obj) => (
              <NavLink
                key={obj.name}
                to={obj.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {obj.name}
                </Button>
              </NavLink>
            ))}
          </Box>

          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Stack
                direction="row"
                paddingBottom={2}
                paddingTop={1}
                paddingLeft={1}
                paddingRight={3}
                spacing={1}
              >
                <Button
                  onClick={(e) => handleChangeLanguge(e, "UK")}
                  className={
                    currentActiveLanguageElement === "languageButtonUK"
                      ? "selectedPortalLanguage"
                      : ""
                  }
                >
                  <Typography textAlign="center" variant="h3">
                    🇬🇧
                  </Typography>
                </Button>
                <Button
                  onClick={(e) => handleChangeLanguge(e, "HU")}
                  className={
                    currentActiveLanguageElement === "languageButtonHU"
                      ? "selectedPortalLanguage"
                      : ""
                  }
                >
                  <Typography textAlign="center" variant="h3">
                    🇭🇺
                  </Typography>
                </Button>
              </Stack>
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            {!user ? (
              <>
                <IconButton sx={{ p: 0 }}>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ color: "white", padding: "10px" }}
                    >
                      Sign In
                    </Typography>
                  </NavLink>
                </IconButton>
                <IconButton sx={{ p: 0 }}>
                  <NavLink
                    to="/register"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Typography
                      textAlign="center"
                      sx={{ color: "white", padding: "10px" }}
                    >
                      Sign Up
                    </Typography>
                  </NavLink>
                </IconButton>
              </>
            ) : (
              <>
                <IconButton sx={{ p: 0 }}>
                  <Avatar src="" title={user.displayName} />
                </IconButton>
                <IconButton sx={{ p: 0 }} onClick={() => logoutUser()}>
                  <LogoutIcon sx={{ color: "white" }} />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default PageNavigation;
