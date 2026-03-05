import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Brightness2Icon from "@mui/icons-material/Brightness2"; // moon icon
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // sun icon
import CircleIcon from "@mui/icons-material/Circle"; // for colored circles
import Box from "@mui/material/Box";

import { useTheme } from "./ThemeContext";
import { themeConfig } from "./themeConfig";

const LAYOUT_CONFIG = {
  buttonPosition: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 1500,
  },
  buttonStyling: {
    darkThemeBgColor: "#D9FEFF",
    darkThemeHoverColor: "#8EFBFF",
    darkThemeIconColor: "#000",
  },
  menuAnchorOrigin: {
    vertical: "bottom",
    horizontal: "right",
  },
  menuTransformOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  menuItemGap: 1,
};

export default function ThemeSelector({ config = themeConfig }) {
  const { theme, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleSelectTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    handleClose();
  };

  const iconButtonSx = {
    ...LAYOUT_CONFIG.buttonPosition,
    bgcolor: theme === "dark" ? LAYOUT_CONFIG.buttonStyling.darkThemeBgColor : "background.paper",
    boxShadow: 3,
    "&:hover": {
      bgcolor: theme === "dark" ? LAYOUT_CONFIG.buttonStyling.darkThemeHoverColor : "background.default",
    },
  };

  const iconBoxSx = {
    color: theme === "dark" ? LAYOUT_CONFIG.buttonStyling.darkThemeIconColor : "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    "& svg": {
      color: theme === "dark" ? LAYOUT_CONFIG.buttonStyling.darkThemeIconColor : "inherit",
    },
  };

  const menuItemSx = {
    display: "flex",
    alignItems: "center",
    gap: LAYOUT_CONFIG.menuItemGap,
  };

  return (
    <>
      <Tooltip title="Select Theme">
        <IconButton
          onClick={handleOpen}
          color="inherit"
          aria-controls={open ? "theme-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={iconButtonSx}
          size="large"
        >
          <Box sx={iconBoxSx}>
            {config.themeIcons[theme] || <CircleIcon />}
          </Box>
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "theme-button" }}
        anchorOrigin={LAYOUT_CONFIG.menuAnchorOrigin}
        transformOrigin={LAYOUT_CONFIG.menuTransformOrigin}
      >
        {Object.entries(config.themeLabels).map(([key, label]) => (
          <MenuItem
            key={key}
            selected={key === theme}
            onClick={() => handleSelectTheme(key)}
            sx={menuItemSx}
          >
            {config.themeIcons[key]}
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}