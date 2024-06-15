import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#cf9f00",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#1d1d4b",
    },
    text: {
      primary: "#e9e9e9",
    },
  },
  typography: {
    fontFamily: "Assistant",
  },
});

export default theme;
