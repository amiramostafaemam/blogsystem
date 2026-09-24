import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Drawer, Toolbar } from "@mui/material";
import Navbar from "./Navbar";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";

const paperSx = {
  width: SIDEBAR_WIDTH,
  bgcolor: "background.default",
  backgroundImage: "none",
  borderRight: 1,
  borderColor: "divider",
};

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar onMenuClick={() => setMobileOpen((prev) => !prev)} />

      <Box component="nav" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobile}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": paperSx }}
        >
          <Toolbar />
          <Sidebar onNavigate={closeMobile} />
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": paperSx }}
        >
          <Toolbar />
          <Sidebar />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
