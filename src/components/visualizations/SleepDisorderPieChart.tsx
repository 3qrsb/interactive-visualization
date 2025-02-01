import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SleepRecord } from "../../types/SleepRecord";

interface Props {
  data: SleepRecord[];
}

const SleepDisorderPieChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const disorderCounts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d["Sleep Disorder"]
    );

    const pieGenerator = d3.pie<[string, number]>().value((d) => d[1]);
    const arcData = pieGenerator(disorderCounts);

    const arcGenerator = d3
      .arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(0)
      .outerRadius(radius);

    const color = d3
      .scaleOrdinal<string>()
      .domain(disorderCounts.map((d) => d[0]))
      .range(d3.schemeCategory10);

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

    g.selectAll("path")
      .data(arcData)
      .enter()
      .append("path")
      .attr("d", (d) => arcGenerator(d) || "")
      .attr("fill", (d) => color(d.data[0]) as string)
      .on("mouseover", (event, d) => {
        tooltip
          .html(
            `<strong>Sleep Disorder:</strong> ${d.data[0]}<br/><strong>Count:</strong> ${d.data[1]}`
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

    g.selectAll("text")
      .data(arcData)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => d.data[0]);

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default SleepDisorderPieChart;
