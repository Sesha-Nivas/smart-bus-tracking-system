import { AppBar, Toolbar, Typography } from "@mui/material";

function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6">
          Smart Bus Tracking System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;