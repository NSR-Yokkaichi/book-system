import { createTheme } from "@mui/material/styles";

export const studentsTheme = createTheme({
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

export const adminTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4a6fa5",
    },
    secondary: {
      main: "#5c8374",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#5d7a8a",
    },
    background: {
      default: "#eef2f7",
      paper: "#f8fafc",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorInherit: {
          backgroundColor: "#4a6fa5",
          color: "#f8fafc",
        },
      },
      defaultProps: {
        color: "inherit",
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#2c3e50",
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "none",
          },
        },
      },
    },
  },
});
