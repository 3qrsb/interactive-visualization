import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { SleepRecord } from "../../types/SleepRecord";
import SleepDurationLineChart from "./SleepDurationLineChart";
import SleepDisorderPieChart from "./SleepDisorderPieChart";
import BMICategoryBarChart from "./BMICategoryBarChart";

const SleepVisualization: React.FC = () => {
  const [data, setData] = useState<SleepRecord[]>([]);

  useEffect(() => {
    d3.csv("/data.csv").then((loadedData) => {
      const processedData = loadedData.map((d) => {
        return d as unknown as SleepRecord;
      });
      setData(processedData);
    });
  }, []);

  if (data.length === 0) {
    return <div>Loading data...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sleep Health and Lifestyle Visualization</h1>
      {/* Sleep Duration vs. Age */}
      <div>
        <h2>Sleep Duration vs. Age</h2>
        <SleepDurationLineChart data={data} />
      </div>
      <hr />
      {/* Sleep Disorder Distribution */}
      <div>
        <h2>Sleep Disorder Distribution</h2>
        <SleepDisorderPieChart data={data} />
      </div>
      <hr />
      {/* BMI Category Counts */}
      <div>
        <h2>BMI Category Distribution</h2>
        <BMICategoryBarChart data={data} />
      </div>
    </div>
  );
};

export default SleepVisualization;
