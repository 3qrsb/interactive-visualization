import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SleepRecord } from "../../types/SleepRecord";

interface Props {
  data: SleepRecord[];
}

const SleepDurationLineChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const processed = data
      .map((d) => {
        const ageStr = d.Age ? d.Age.toString().trim() : "";
        const sleepStr = d["Sleep Duration"]
          ? d["Sleep Duration"].toString().trim()
          : "";
        return {
          age: parseFloat(ageStr),
          sleepDuration: parseFloat(sleepStr),
        };
      })
      .filter((d) => !isNaN(d.age) && !isNaN(d.sleepDuration));

    if (processed.length === 0) {
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight / 2)
        .attr("text-anchor", "middle")
        .text("No valid data to display");
      return;
    }

    const xExtent = d3.extent(processed, (d) => d.age) as [number, number];
    const yExtent = d3.extent(processed, (d) => d.sleepDuration) as [
      number,
      number
    ];

    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([innerHeight, 0])
      .nice();

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(10)
      .tickFormat((d) => `${d} yrs`);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(10)
      .tickFormat((d) => `${d} hrs`);

    g.append("g").attr("transform", `translate(0, ${innerHeight})`).call(xAxis);
    g.append("g").call(yAxis);

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Age");
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Sleep Duration (hrs)");

    const lineGenerator = d3
      .line<{ age: number; sleepDuration: number }>()
      .x((d) => xScale(d.age))
      .y((d) => yScale(d.sleepDuration))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(processed.sort((a, b) => a.age - b.age))
      .attr("fill", "none")
      .attr("stroke", "#007acc")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

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

    g.selectAll("circle")
      .data(processed)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.age))
      .attr("cy", (d) => yScale(d.sleepDuration))
      .attr("r", 4)
      .attr("fill", "#007acc")
      .on("mouseover", (event, d) => {
        tooltip
          .html(
            `<strong>Age:</strong> ${d.age}<br/><strong>Sleep Duration:</strong> ${d.sleepDuration} hrs`
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

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoomBehavior);

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default SleepDurationLineChart;
