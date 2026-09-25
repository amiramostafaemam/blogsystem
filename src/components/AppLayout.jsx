import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Navbar from "./Navbar";
import Sidebar, { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from "./Sidebar";

const STORAGE_KEY = "crema:sidebar-collapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

const paperBase = {
  bgcolor: "background.default",
  backgroundImage: "none",
  borderRight: 1,
  borderColor: "divider",
};

function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const closeMobile = () => setMobileOpen(false);

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const slide = theme.transitions.create("width", { duration: theme.transitions.duration.shorter });

  // One menu button: collapses the rail on desktop, opens the drawer on mobile
  const handleMenu = () => {
    if (!isDesktop) {
      setMobileOpen((prev) => !prev);
      return;
    }
    setCollapsed((prev) => {
      try {
        localStorage.setItem(STORAGE_KEY, prev ? "0" : "1");
      } catch {
        // storage unavailable: the choice just won't be remembered
      }
      return !prev;
    });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar onMenuClick={handleMenu} menuExpanded={isDesktop ? !collapsed : mobileOpen} />

      <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 }, transition: slide }}>
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobile}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { ...paperBase, width: SIDEBAR_WIDTH } }}
        >
          <Toolbar />
          <Sidebar onNavigate={closeMobile} />
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { ...paperBase, width, transition: slide, overflowX: "hidden" },
          }}
        >
          <Toolbar />
          <Sidebar collapsed={collapsed} />
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
