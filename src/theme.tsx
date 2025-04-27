import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
// const liadTheme = createTheme({
//   direction: "rtl",
//   palette: {
//     primary: {
//       main: "#cf9f00",
//     },
//     secondary: {
//       main: "#19857b",
//     },
//     error: {
//       main: red.A400,
//     },
//     background: {
//       default: "#1d1d4b",
//     },
//     text: {
//       primary: "#e9e9e9",
//     },
//   },
//   typography: {
//     fontFamily: "Assistant",
//   },
// });

// const orenTheme = createTheme({
//   direction: "rtl",
//   palette: {
//     primary: {
//       main: "#d84646",
//     },
//     secondary: {
//       main: "#d84646",
//     },
//     error: {
//       main: red.A400,
//     },
//     background: {
//       default: "#2c2c2c",
//     },
//     text: {
//       primary: "#e9e9e9",
//     },
//   },
//   typography: {
//     fontFamily: "Assistant",
//   },
// });

const praimoTheme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#003366", // a richer navy blue
      light: "#336699", // optional: a nice lighter tone for hover states
      dark: "#001f3f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffaa00", // a warmer, more energetic amber
      light: "#ffcc66",
      dark: "#cc8800",
      contrastText: "#2c2c2c",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#1f1f1f", // slightly darker than #2c2c2c to give a bit more "pop"
      paper: "#2c2c2c", // for card backgrounds etc.
    },
    text: {
      primary: "#e0e0e0", // slightly softened from pure white
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: "Assistant",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: { textTransform: "none" }, // optional: no caps on buttons for a sleeker look
  },
});

export default function theme(person?: String) {
  if (person == "liad") {
    return praimoTheme
  }
  else if (person == "oren") {
    return praimoTheme
  } else if (person == "praimo") {
    return praimoTheme
  } else {
    return praimoTheme
  }
}

