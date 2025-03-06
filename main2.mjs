import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import alphabet from "./data.json" with { type: "json" };

// Specify the chart’s dimensions, based on a bar’s height.
const barHeight = 42;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 40;
const marginLeft = 160;
const width = Math.min(500, window.innerWidth - 64);
const radius = 0;
const height = Math.ceil((alphabet.length + 0.1) * barHeight) + marginTop + marginBottom;

// Create the scales.
const x = d3.scaleLinear()
    .domain([0, d3.max(alphabet, d => d.frequency)])
    .range([marginLeft, width - marginRight]);

const y = d3.scaleBand()
    .domain(d3.sort(alphabet, d => -d.frequency).map(d => d.letter))
    .rangeRound([marginTop, height - marginBottom])
    .padding(0.6);

const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style",
        `
        max-width: 100%;
        height: auto;
        font: 10px sans-serif;
        background-color: #faf6f6;
        padding: 16px;
        border-radius: 16px;
        margin-top: 16px;
        `);

// Tạo các thanh màu xanh
svg.append("g")
    .attr("fill", "#3f7aab")
    .selectAll()
    .data(alphabet)
    .join("rect")
    .attr("x", x(0))
    .attr("y", (d) => y(d.letter))
    .attr("width", (d) => x(d.frequency) - x(0))
    .attr("height", y.bandwidth())
    .attr("rx", radius);

const format = x.tickFormat(20/* , "%" */);
// Hiển thị giá trị của mỗi thanh
svg.append("g")
    .attr("fill", "#fff")
    .attr("text-anchor", "end")
    .selectAll()
    .data(alphabet)
    .join("text")
    .attr("x", (d) => x(d.frequency))
    .attr("y", (d) => y(d.letter) + y.bandwidth() / 2)
    .attr("dx", -6)
    .attr("dy", "0.35em")
    .text((d) => format(d.frequency))
    // condition: nếu giá trị nhỏ 
    .call((text) => text.filter(d => x(d.frequency) - x(0) < 20) // short bars
        .attr("dx", +4)
        .attr("fill", "#3c3c43")
        .attr("text-anchor", "start"));

// Tạo trục x
const formatXTick = d => d === 0 ? "0K" : d3.format("~s")(d);
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom + 30})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickFormat(formatXTick))
    .call(g => g.selectAll(".tick text").attr("dy", -16).attr("fill", "#7e7c84"))
    .call(g => g.selectAll(".tick line").attr("stroke", "#7e7c84"))
    .call(g => g.select(".domain").remove());

// Tao trục y
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").attr("stroke", "none"))
    .call(g => g.selectAll(".tick text").attr("fill", "#7c7c7c"));

chart.append(svg.node());

content.innerHTML = `
  The chart illustrates the number of users who are studying for a variety of reasons.<br>
  There is a large difference in users' interests among six categories. Most users, around 22,000, want to study for the purpose of "Job opportunities".
`;