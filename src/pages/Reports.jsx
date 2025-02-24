import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const reportData = [
    { id: 1, name: "John Doe", class: "10A", paid: 5000, due: 0, status: "Paid", date: "2025-01-31", mode: "Online" },
    { id: 2, name: "Jane Smith", class: "10B", paid: 3000, due: 2000, status: "Pending", date: "2025-01-15", mode: "Cash" },
    { id: 3, name: "Alice Brown", class: "10A", paid: 0, due: 5000, status: "Overdue", date: "2025-02-01", mode: "Cheque" },
  ];

  const filteredData = reportData.filter(
    (row) =>
      (filterStatus === "All" || row.status === filterStatus) &&
      (row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.id.toString().includes(searchTerm) ||
        row.class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const csvData = [
    ["ID", "Student Name", "Class", "Amount Paid", "Pending Dues", "Payment Status", "Date", "Payment Mode"],
    ...filteredData.map((row) => [row.id, row.name, row.class, row.paid, row.due, row.status, row.date, row.mode]),
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Fees Collected",
        data: [15000, 17000, 16000, 18000, 19000],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const pieData = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Collection Trend",
        data: [12000, 14000, 13000, 15000, 16000],
        borderColor: "#42A5F5",
        fill: false,
      },
    ],
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Fee Reports & Analytics
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search by Name, ID, or Class"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Filter by Payment Status"
            variant="outlined"
            fullWidth
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4} mb={8}>
        <Grid item xs={12} md={4}><Bar data={barData} /></Grid>
        <Grid item xs={12} md={4}><Pie data={pieData} /></Grid>
        <Grid item xs={12} md={4}><Line data={lineData} /></Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Pending Dues</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Payment Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.class}</TableCell>
                <TableCell>{row.paid}</TableCell>
                <TableCell>{row.due}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.mode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
  
};

export default Reports;
