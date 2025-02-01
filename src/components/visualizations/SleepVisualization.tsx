import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { SleepRecord } from "../../types/SleepRecord";
import SleepDurationLineChart from "./SleepDurationLineChart";
import SleepDisorderPieChart from "./SleepDisorderPieChart";
import BMICategoryBarChart from "./BMICategoryBarChart";

import { Box, Typography, Divider, CircularProgress } from "@mui/material";

const SleepVisualization: React.FC = () => {
  const [data, setData] = useState<SleepRecord[]>([]);

  useEffect(() => {
    d3.csv("/data.csv").then((loadedData) => {
      const processedData = loadedData.map((d) => d as unknown as SleepRecord);
      setData(processedData);
    });
  }, []);

  if (data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sleep Health and Lifestyle Visualization
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sleep Duration vs. Age
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SleepDurationLineChart data={data} />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sleep Disorder Distribution
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <SleepDisorderPieChart data={data} />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          BMI Category Distribution
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <BMICategoryBarChart data={data} />
        </Box>
      </Box>
    </Box>
  );
};

export default SleepVisualization;
