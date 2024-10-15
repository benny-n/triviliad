import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const liadTheme = createTheme({
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

const orenTheme = createTheme({
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
    fontFamily: "Brush Script MT",
  },
});

export default function theme(person?: String) {
  if (person == "liad") {
    return liadTheme
  }
  else if (person == "oren") {
    return orenTheme
  } else {
    return liadTheme
  }
}

