import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SleepRecord } from "../../types/SleepRecord";

interface Props {
  data: SleepRecord[];
}

const BMICategoryBarChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const bmiCounts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d["BMI Category"]
    );

    const xScale = d3
      .scaleBand<string>()
      .domain(bmiCounts.map((d) => d[0]))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bmiCounts, (d) => d[1])!])
      .nice()
      .range([innerHeight, 0]);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    g.append("g").call(d3.axisLeft(yScale));

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll("rect")
      .data(bmiCounts)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d[0])!)
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d[1]))
      .attr("fill", "#6b5b95")
      .on("mouseover", (event, d) => {
        tooltip
          .html(
            `<strong>BMI Category:</strong> ${d[0]}<br/><strong>Count:</strong> ${d[1]}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
          .transition()
          .duration(200)
          .style("opacity", 0.9);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BMICategoryBarChart;
