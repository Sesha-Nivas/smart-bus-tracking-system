import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 200;

function Sidebar() {

  const navigate = useNavigate();

  return (

    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box"
        }
      }}
    >

      <List>

        <ListItemButton onClick={() => navigate("/")}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/buses")}>
          <ListItemText primary="Buses" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/drivers")}>
          <ListItemText primary="Drivers" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/colleges")}>
          <ListItemText primary="Colleges" />
        </ListItemButton>

      </List>

    </Drawer>
  );
}

export default Sidebar;