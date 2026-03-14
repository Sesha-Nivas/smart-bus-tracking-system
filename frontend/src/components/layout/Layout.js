import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

const drawerWidth = 200;

function Layout({ children }) {

  return (

    <Box sx={{ display: "flex" }}>

      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>

        <Header />

        <Box
          sx={{
            marginLeft: `${drawerWidth}px`,
            padding: "30px",
            marginTop: "20px"
          }}
        >
          {children}
        </Box>

      </Box>

    </Box>

  );

}

export default Layout;