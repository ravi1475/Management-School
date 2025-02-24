import React from "react";
import { RadialBarChart, RadialBar } from "recharts";

const data = [
  { name: "Male", value: 125, fill: "#8A2BE2" }, // Purple
  { name: "Female", value: 150, fill: "#FF1493" }, // Pink
  { name: "other", value: 110, fill: "#DA70D6" }, // Light Purple
];

const totalStudents = data.reduce((acc, item) => acc + item.value, 0);

const CustomLegend = () => (
  <div style={{ paddingLeft: 20, fontSize: 14 }}>
    {data.map((entry, index) => (
      <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: entry.fill,
            marginRight: 5,
          }}
        ></span>
        <span style={{ flex: 1 }}>{entry.name}</span>
        <span style={{ fontWeight: "bold" }}>{entry.value}</span>
      </div>
    ))}
  </div>
);

const StudentChart = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        borderRadius: 10,
        padding: 20,
        width: 320,
        textAlign: "center",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 }}>
        Students by Gender
      </h3>

      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <RadialBarChart
          width={250}
          height={250}
          cx={125}
          cy={125}
          innerRadius={80}
          outerRadius={100}
          barSize={15}
          data={data}
        >
          <RadialBar minAngle={15} background clockWise dataKey="value" animationDuration={1000} />
        </RadialBarChart>

        {/* Centered Total Count */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>{totalStudents}</p>
          <p style={{ fontSize: 12, color: "#666" }}>Total Students</p>
        </div>
      </div>

      <CustomLegend />
    </div>
  );
};

export default StudentChart;
