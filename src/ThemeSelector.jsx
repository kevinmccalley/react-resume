import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import CircleIcon from "@mui/icons-material/Circle";
import Box from "@mui/material/Box";

import { useTheme } from "./ThemeContext";
import { themeConfig } from "./themeConfig";
import { layoutConfig } from "./layoutConfig";

const THEME_SELECTOR_LAYOUT = {
  buttonPosition: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 1500,
  },
  buttonStyling: {
    boxShadow: 3,
    size: "large",
  },
  iconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
  },
};

export default function ThemeSelector({ config = themeConfig, layout = layoutConfig }) {
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
    ...THEME_SELECTOR_LAYOUT.buttonPosition,
    bgcolor: theme === "dark" ? layout.buttonStyling.darkThemeBgColor : "background.paper",
    boxShadow: THEME_SELECTOR_LAYOUT.buttonStyling.boxShadow,
    "&:hover": {
      bgcolor: theme === "dark" ? layout.buttonStyling.darkThemeHoverColor : "background.default",
    },
  };

  const iconBoxSx = {
    color: theme === "dark" ? layout.buttonStyling.darkThemeIconColor : "inherit",
    ...THEME_SELECTOR_LAYOUT.iconBox,
    "& svg": {
      color: theme === "dark" ? layout.buttonStyling.darkThemeIconColor : "inherit",
    },
  };

  const menuItemSx = {
    ...THEME_SELECTOR_LAYOUT.menuItem,
    gap: layout.menuItemGap,
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
          size={THEME_SELECTOR_LAYOUT.buttonStyling.size}
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
        anchorOrigin={layout.menuAnchorOrigin}
        transformOrigin={layout.menuTransformOrigin}
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