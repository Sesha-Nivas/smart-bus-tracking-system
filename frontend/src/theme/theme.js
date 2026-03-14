import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32",
    },
    secondary: {
      main: "#A5D6A7",
    },
    background: {
      default: "#F4F6F8",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;