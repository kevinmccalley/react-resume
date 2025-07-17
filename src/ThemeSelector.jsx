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

const themeColors = {
  dark: "#000000",
  light: "#ffffff",
  orange: "#FFA500",
  cherry: "#fbb6ce",
  lime: "#a6e22e",
};

const themeIcons = {
  dark: <Brightness2Icon />,
  light: <WbSunnyIcon />,
  orange: <CircleIcon style={{ color: themeColors.orange }} fontSize="small" />,
  cherry: <CircleIcon style={{ color: themeColors.cherry }} fontSize="small" />,
  lime: <CircleIcon style={{ color: themeColors.lime }} fontSize="small" />,
};

const themeLabels = {
  dark: "Dark",
  light: "Light",
  orange: "Orange",
  cherry: "Cherry",
  lime: "Lime",
};

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleSelectTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    handleClose();
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
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1500,
            bgcolor: theme === "dark" ? "#ffff33" : "background.paper",
            boxShadow: 3,
            "&:hover": {
              bgcolor: theme === "dark" ? "#cccc00" : "background.default",
            },
          }}
          size="large"
        >
          <Box
            sx={{
              color: theme === "dark" ? "#000" : "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              "& svg": {
                color: theme === "dark" ? "#000" : "inherit",
              },
            }}
          >
            {themeIcons[theme] || <CircleIcon />}
          </Box>
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "theme-button" }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {Object.entries(themeLabels).map(([key, label]) => (
          <MenuItem
            key={key}
            selected={key === theme}
            onClick={() => handleSelectTheme(key)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {themeIcons[key]}
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
