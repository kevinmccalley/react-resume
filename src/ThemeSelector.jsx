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
    ...layout.buttonPosition,
    bgcolor: theme === "dark" ? layout.buttonStyling.darkThemeBgColor : "background.paper",
    boxShadow: 3,
    "&:hover": {
      bgcolor: theme === "dark" ? layout.buttonStyling.darkThemeHoverColor : "background.default",
    },
  };

  const iconBoxSx = {
    color: theme === "dark" ? layout.buttonStyling.darkThemeIconColor : "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    "& svg": {
      color: theme === "dark" ? layout.buttonStyling.darkThemeIconColor : "inherit",
    },
  };

  const menuItemSx = {
    display: "flex",
    alignItems: "center",
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