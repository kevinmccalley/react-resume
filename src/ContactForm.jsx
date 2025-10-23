import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "./ThemeContext";

const focusColors = {
  light: "#1976d2",
  dark: "#D9FEFF", // corrected light blue for dark theme
  orange: "#f97316",
  cherry: "#f9a8d4",
  lime: "#84cc16",
};

const defaultBorderColors = {
  light: "#999",
  dark: "#888",
  orange: "#c75a0d",
  cherry: "#c77aa0",
  lime: "#67910e",
};

const inputTextColors = {
  light: "#222",
  dark: "#eee",
  orange: "#4b2e00",
  cherry: "#5a2e44",
  lime: "#354500",
};

const labelColors = {
  light: "#555",
  dark: "#ccc",
  orange: "#a85f2b",
  cherry: "#9c5378",
  lime: "#577102",
};

const buttonColors = {
  light: {
    bg: "#1976d2",
    hover: "#115293",
    text: "#fff",
  },
  dark: {
    bg: "#D9FEFF", // corrected blue for dark mode
    hover: "#b2f5f7",
    text: "#000",
  },
  orange: {
    bg: "#f97316",
    hover: "#b44f0c",
    text: "#fff",
  },
  cherry: {
    bg: "#f9a8d4",
    hover: "#c47ea5",
    text: "#000",
  },
  lime: {
    bg: "#84cc16",
    hover: "#5f870e",
    text: "#000",
  },
};

const ContactForm = () => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isHuman, setIsHuman] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name";
    if (!formData.email.trim()) return "Email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Valid Email";
    if (!formData.message.trim()) return "Message";
    if (!isHuman) return "Human Verification";
    return null;
  };

  useEffect(() => {
    const invalidField = validateForm();
    setIsFormValid(!invalidField);
  }, [formData, isHuman]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const invalidField = validateForm();
    if (invalidField) {
      setStatus("error");
      setErrorMsg(`Please complete the required field: ${invalidField}.`);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("https://formspree.io/f/mzzvzala", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.target),
      });

      const result = await response.json();

      if (result.ok || response.status === 200) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsHuman(false);
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const btnColors = buttonColors[theme] || buttonColors.light;
  const isDark = theme === "dark";

  const disabledDark = {
    backgroundColor: "#555",
    color: "#f4f4f4",
    border: "1px solid #7a7a7a",
  };

  const disabledLight = {
    backgroundColor: "#ccc",
    color: "#666",
    border: "1px solid #bdbdbd",
  };

  const disabledStyles = isDark ? disabledDark : disabledLight;

  // Assign proper color for the toggle depending on theme
  const toggleColor =
    theme === "dark"
      ? "#D9FEFF"
      : buttonColors[theme]?.bg || focusColors.light;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        backgroundColor: "transparent",
        p: 2,
      }}
    >
      {["name", "email", "phone", "message"].map((field) => (
        <TextField
          key={field}
          required={field !== "phone"}
          fullWidth
          margin="normal"
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          name={field}
          type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
          multiline={field === "message"}
          minRows={field === "message" ? 4 : undefined}
          value={formData[field]}
          onChange={handleChange}
          sx={{
            backgroundColor: isDark ? "#0e0e0e" : "transparent",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: defaultBorderColors[theme] || "#999",
              },
              "&:hover fieldset": {
                borderColor: focusColors[theme] || "#1976d2",
              },
              "&.Mui-focused fieldset": {
                borderColor: focusColors[theme] || "#1976d2",
                boxShadow: `0 0 0 2px ${
                  (focusColors[theme] || "#1976d2") + "33"
                }`,
              },
            },
            "& .MuiInputBase-input, & textarea": {
              color: inputTextColors[theme] || "#222",
            },
            "& .MuiInputBase-input::placeholder, & textarea::placeholder": {
              color: isDark ? "#aaa" : "#888",
              opacity: 1,
            },
            "& label": {
              color: labelColors[theme] || "#555",
              "&.Mui-focused": {
                color: focusColors[theme] || "#1976d2",
              },
            },
          }}
        />
      ))}

      <FormControlLabel
        control={
          <Switch
            checked={isHuman}
            onChange={(e) => setIsHuman(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: toggleColor,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: toggleColor,
              },
            }}
          />
        }
        label="I am human"
        sx={{ mt: 1 }}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid || status === "sending"}
          sx={{
            backgroundColor: !(!isFormValid || status === "sending")
              ? btnColors.bg
              : disabledStyles.backgroundColor,
            color: !(!isFormValid || status === "sending")
              ? btnColors.text
              : disabledStyles.color,
            textTransform: "none",
            border: !(!isFormValid || status === "sending")
              ? undefined
              : disabledStyles.border,
            cursor: !isFormValid ? "not-allowed" : "pointer",
            "&.Mui-disabled": {
              backgroundColor: `${disabledStyles.backgroundColor} !important`,
              color: `${disabledStyles.color} !important`,
              border: disabledStyles.border,
              opacity: 1,
              pointerEvents: "none",
              boxShadow: "none",
            },
            "&.Mui-disabled:hover": {
              backgroundColor: `${disabledStyles.backgroundColor} !important`,
            },
            "&:hover": {
              backgroundColor:
                !(!isFormValid || status === "sending")
                  ? btnColors.hover
                  : disabledStyles.backgroundColor,
            },
            transition: "background-color 0.18s ease, color 0.18s ease",
            "& .MuiButton-startIcon, & .MuiButton-endIcon, & > span": {
              color: !(!isFormValid || status === "sending")
                ? btnColors.text
                : disabledStyles.color,
            },
          }}
        >
          {status === "sending" ? (
            <>
              Sending... <CircularProgress size={20} sx={{ ml: 1 }} />
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </Box>

      {status === "success" && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Thank you! Your message has been sent.
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMsg || "Something went wrong. Please try again."}
        </Alert>
      )}
    </Box>
  );
};

export default ContactForm;
