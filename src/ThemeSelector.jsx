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

const createIconsFactory = (colors) => ({
  dark: () => <Brightness2Icon />,
  light: () => <WbSunnyIcon />,
  orange: () => <CircleIcon style={{ color: colors.orange }} fontSize="small" />,
  cherry: () => <CircleIcon style={{ color: colors.cherry }} fontSize="small" />,
  lime: () => <CircleIcon style={{ color: colors.lime }} fontSize="small" />,
});

const THEME_CONFIG = {
  colors: {
    dark: "#000000",
    light: "#ffffff",
    orange: "#FFA500",
    cherry: "#fbb6ce",
    lime: "#a6e22e",
  },
  labels: {
    dark: "Dark",
    light: "Light",
    orange: "Orange",
    cherry: "Cherry",
    lime: "Lime",
  },
  iconFactory: createIconsFactory({
    dark: "#000000",
    light: "#ffffff",
    orange: "#FFA500",
    cherry: "#fbb6ce",
    lime: "#a6e22e",
  }),
};

export default function ThemeSelector({ themeConfig = THEME_CONFIG }) {
  const { theme, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const themeIconFactory = themeConfig.iconFactory;
  const themeLabels = themeConfig.labels;

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
            bgcolor: theme === "dark" ? "#D9FEFF" : "background.paper",
            boxShadow: 3,
            "&:hover": {
              bgcolor: theme === "dark" ? "#8EFBFF" : "background.default",
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
            {themeIconFactory[theme] ? themeIconFactory[theme]() : <CircleIcon />}
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
            {themeIconFactory[key] ? themeIconFactory[key]() : <CircleIcon />}
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}