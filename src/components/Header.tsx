import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import BarChartIcon from "@mui/icons-material/BarChart";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box
      sx={{
        width: "95%",
        mx: "auto",
        mt: 2,
        mb: 2,
      }}
    >
      <AppBar
        position="static"
        sx={{
          borderRadius: 2,
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Visualizations
          </Typography>
          <Tabs
            value={location.pathname}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            aria-label="Navigation Tabs"
          >
            <Tab icon={<BarChartIcon />} label="Charts" value="/charts" />
            <Tab icon={<ThreeDRotationIcon />} label="3D Scene" value="/3d" />
            <Tab label="News Feed" value="/news" />
          </Tabs>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
