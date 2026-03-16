import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8c7851",
    },
    secondary: {
      main: "#f25042",
    },
    text: {
      primary: "#020826",
      secondary: "#716040",
    },
    background: {
      default: "#f9f4ef",
      paper: "#fffffe",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorInherit: {
          backgroundColor: "#716040",
          color: "#fffffe",
        },
      },
      defaultProps: {
        color: "inherit",
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#020826",
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "none",
          },
        },
      },
    },
  },
});
