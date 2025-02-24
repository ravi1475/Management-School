// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   TextField,
//   MenuItem,
// } from "@mui/material";
// import { Bar, Pie, Line } from "react-chartjs-2";
// import { CSVLink } from "react-csv";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// const Reports = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");

//   const reportData = [
//     { id: 1, name: "John Doe", class: "10A", paid: 5000, due: 0, status: "Paid", date: "2025-01-31", mode: "Online" },
//     { id: 2, name: "Jane Smith", class: "10B", paid: 3000, due: 2000, status: "Pending", date: "2025-01-15", mode: "Cash" },
//     { id: 3, name: "Alice Brown", class: "10A", paid: 0, due: 5000, status: "Overdue", date: "2025-02-01", mode: "Cheque" },
//   ];

//   const filteredData = reportData.filter(
//     (row) =>
//       (filterStatus === "All" || row.status === filterStatus) &&
//       (row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         row.id.toString().includes(searchTerm) ||
//         row.class.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const csvData = [
//     ["ID", "Student Name", "Class", "Amount Paid", "Pending Dues", "Payment Status", "Date", "Payment Mode"],
//     ...filteredData.map((row) => [row.id, row.name, row.class, row.paid, row.due, row.status, row.date, row.mode]),
//   ];

//   const barData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//     datasets: [
//       {
//         label: "Fees Collected",
//         data: [15000, 17000, 16000, 18000, 19000],
//         backgroundColor: "rgba(54, 162, 235, 0.5)",
//       },
//     ],
//   };

//   const pieData = {
//     labels: ["Paid", "Pending", "Overdue"],
//     datasets: [
//       {
//         data: [60, 25, 15],
//         backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
//       },
//     ],
//   };

//   const lineData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//     datasets: [
//       {
//         label: "Collection Trend",
//         data: [12000, 14000, 13000, 15000, 16000],
//         borderColor: "#42A5F5",
//         fill: false,
//       },
//     ],
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Fee Reports & Analytics</h1>

//       {/* Filters */}
//       <div className="mb-4 flex gap-4">
//         <TextField
//           label="Search by Name, ID, or Class"
//           variant="outlined"
//           fullWidth
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <TextField
//           select
//           label="Filter by Payment Status"
//           variant="outlined"
//           fullWidth
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//         >
//           <MenuItem value="All">All</MenuItem>
//           <MenuItem value="Paid">Paid</MenuItem>
//           <MenuItem value="Pending">Pending</MenuItem>
//           <MenuItem value="Overdue">Overdue</MenuItem>
//         </TextField>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-3 gap-4 mb-8">
//         <Bar data={barData} />
//         <Pie data={pieData} />
//         <Line data={lineData} />
//       </div>

//       {/* Table */}
//       <TableContainer component={Paper} className="mb-4">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Student Name</TableCell>
//               <TableCell>Class</TableCell>
//               <TableCell>Amount Paid</TableCell>
//               <TableCell>Pending Dues</TableCell>
//               <TableCell>Payment Status</TableCell>
//               <TableCell>Payment Date</TableCell>
//               <TableCell>Payment Mode</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredData.map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.class}</TableCell>
//                 <TableCell>{row.paid}</TableCell>
//                 <TableCell>{row.due}</TableCell>
//                 <TableCell>{row.status}</TableCell>
//                 <TableCell>{row.date}</TableCell>
//                 <TableCell>{row.mode}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Export Options */}
//       <Button variant="contained" color="primary" className="mr-4">
//         <CSVLink data={csvData} filename="fee_reports.csv" style={{ color: "#fff", textDecoration: "none" }}>
//           Export to CSV
//         </CSVLink>
//       </Button>
//       <Button variant="contained" color="secondary" onClick={() => window.print()}>
//         Print Report
//       </Button>
//     </div>
//   );
// };

// export default Reports;



import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

const Reports = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [filterPaymentMode, setFilterPaymentMode] = useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [reportType, setReportType] = useState("detailed");
  const [reportTitle, setReportTitle] = useState("Fee Collection Report");
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columnsToShow, setColumnsToShow] = useState({
    id: true,
    name: true,
    class: true,
    paid: true,
    due: true,
    status: true,
    date: true,
    mode: true,
  });
  
  // Sample data - this would normally come from an API
  const reportData = [
    { id: 1, name: "John Doe", class: "10A", paid: 5000, due: 0, status: "Paid", date: "2025-01-31", mode: "Online" },
    { id: 2, name: "Jane Smith", class: "10B", paid: 3000, due: 2000, status: "Pending", date: "2025-01-15", mode: "Cash" },
    { id: 3, name: "Alice Brown", class: "10A", paid: 0, due: 5000, status: "Overdue", date: "2025-02-01", mode: "Cheque" },
    { id: 4, name: "Robert Johnson", class: "11A", paid: 4500, due: 500, status: "Partially Paid", date: "2025-01-20", mode: "Online" },
    { id: 5, name: "Michael Williams", class: "11B", paid: 5000, due: 0, status: "Paid", date: "2025-01-10", mode: "Cash" },
    { id: 6, name: "Sarah Davis", class: "12A", paid: 2000, due: 3000, status: "Partially Paid", date: "2025-01-25", mode: "Online" },
    { id: 7, name: "Emily Wilson", class: "12B", paid: 0, due: 5000, status: "Overdue", date: "2025-01-05", mode: "Cheque" },
  ];

  // Generate class list from data
  const classList = ["All", ...new Set(reportData.map(item => item.class))];
  
  // Generate payment mode list from data
  const paymentModeList = ["All", ...new Set(reportData.map(item => item.mode))];
  
  // Generate status list from data
  const statusList = ["All", ...new Set(reportData.map(item => item.status))];

  // Filter data based on multiple criteria
  const filteredData = reportData.filter(
    (row) => {
      const statusMatch = filterStatus === "All" || row.status === filterStatus;
      const classMatch = filterClass === "All" || row.class === filterClass;
      const paymentModeMatch = filterPaymentMode === "All" || row.mode === filterPaymentMode;
      const searchMatch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.id.toString().includes(searchTerm) ||
                          row.class.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date range filtering
      let dateMatch = true;
      if (dateRange.startDate && dateRange.endDate) {
        const rowDate = new Date(row.date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        dateMatch = rowDate >= startDate && rowDate <= endDate;
      }
      
      return statusMatch && classMatch && paymentModeMatch && searchMatch && dateMatch;
    }
  );

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Toggle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Select all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedData.map(row => row.id));
    }
  };

  // Handle column visibility toggle
  const toggleColumn = (column) => {
    setColumnsToShow(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Generate summary data
  const summary = {
    totalStudents: filteredData.length,
    totalPaid: filteredData.reduce((sum, row) => sum + row.paid, 0),
    totalDue: filteredData.reduce((sum, row) => sum + row.due, 0),
    totalAmount: filteredData.reduce((sum, row) => sum + row.paid + row.due, 0),
    paidCount: filteredData.filter(row => row.status === "Paid").length,
    pendingCount: filteredData.filter(row => row.status === "Pending").length,
    overdueCount: filteredData.filter(row => row.status === "Overdue").length,
    partiallyPaidCount: filteredData.filter(row => row.status === "Partially Paid").length,
  };

  // Prepare CSV export data
  const getExportData = () => {
    const headers = [
      { label: "ID", key: "id", show: columnsToShow.id },
      { label: "Student Name", key: "name", show: columnsToShow.name },
      { label: "Class", key: "class", show: columnsToShow.class },
      { label: "Amount Paid", key: "paid", show: columnsToShow.paid },
      { label: "Pending Dues", key: "due", show: columnsToShow.due },
      { label: "Payment Status", key: "status", show: columnsToShow.status },
      { label: "Payment Date", key: "date", show: columnsToShow.date },
      { label: "Payment Mode", key: "mode", show: columnsToShow.mode },
    ].filter(header => header.show);

    const dataToExport = selectedRows.length > 0
      ? sortedData.filter(row => selectedRows.includes(row.id))
      : sortedData;

    return {
      headers: headers.map(h => h.label),
      data: dataToExport.map(row => headers.map(h => row[h.key])),
    };
  };

  // Export to PDF function
  const exportToPDF = () => {
    const { headers, data } = getExportData();
    const title = `${reportTitle} - ${new Date().toLocaleDateString()}`;
    
    // Would use jsPDF here, but avoiding external libraries as requested
    // This is just a placeholder for the PDF generation functionality
    console.log("PDF Export:", { title, headers, data });
    alert("PDF Export functionality would be implemented here");
  };

  // Print function
  const printReport = () => {
    window.print();
  };

  // Email report function
  const emailReport = () => {
    alert("Email functionality would be implemented here");
    // Typically would open a dialog to enter email details
  };

  // Save report template
  const saveReportTemplate = () => {
    const template = {
      title: reportTitle,
      type: reportType,
      columns: columnsToShow,
      filters: {
        status: filterStatus,
        class: filterClass,
        paymentMode: filterPaymentMode,
        dateRange
      }
    };
    
    console.log("Saving template:", template);
    alert("Report template saved successfully");
  };

  return (
    <div className="reports-container" style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>{reportTitle}</h1>

      {/* Report Configuration */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Report Title"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            style={{ padding: "8px", width: "300px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          
          <div>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", marginRight: "10px" }}
            >
              <option value="detailed">Detailed Report</option>
              <option value="summary">Summary Report</option>
              <option value="financial">Financial Report</option>
              <option value="student">Student-wise Report</option>
              <option value="class">Class-wise Report</option>
            </select>
            
            <button 
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              style={{ padding: "8px 12px", backgroundColor: "#4a4a4a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Column Settings
            </button>
          </div>
        </div>
        
        {/* Column Settings Panel */}
        {showColumnSettings && (
          <div style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#fff" }}>
            <h3 style={{ marginBottom: "10px", fontSize: "16px" }}>Column Visibility</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.id} 
                  onChange={() => toggleColumn("id")}
                  style={{ marginRight: "5px" }}
                />
                ID
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.name} 
                  onChange={() => toggleColumn("name")}
                  style={{ marginRight: "5px" }}
                />
                Student Name
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.class} 
                  onChange={() => toggleColumn("class")}
                  style={{ marginRight: "5px" }}
                />
                Class
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.paid} 
                  onChange={() => toggleColumn("paid")}
                  style={{ marginRight: "5px" }}
                />
                Amount Paid
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.due} 
                  onChange={() => toggleColumn("due")}
                  style={{ marginRight: "5px" }}
                />
                Pending Dues
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.status} 
                  onChange={() => toggleColumn("status")}
                  style={{ marginRight: "5px" }}
                />
                Payment Status
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.date} 
                  onChange={() => toggleColumn("date")}
                  style={{ marginRight: "5px" }}
                />
                Payment Date
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input 
                  type="checkbox" 
                  checked={columnsToShow.mode} 
                  onChange={() => toggleColumn("mode")}
                  style={{ marginRight: "5px" }}
                />
                Payment Mode
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
        <h3 style={{ marginBottom: "10px", fontSize: "16px" }}>Filter Options</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          <div>
            <input
              type="text"
              placeholder="Search by Name, ID, or Class"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              {statusList.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              {classList.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterPaymentMode}
              onChange={(e) => setFilterPaymentMode(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              {paymentModeList.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
          
          <div>
            <input
              type="date"
              placeholder="Start Date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          
          <div>
            <input
              type="date"
              placeholder="End Date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards - Only shown for summary report type */}
      {reportType === "summary" && (
        <div style={{ marginBottom: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
          <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#fff" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>Total Students</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{summary.totalStudents}</p>
          </div>
          
          <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#fff" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>Total Collected</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>₹{summary.totalPaid.toLocaleString()}</p>
          </div>
          
          <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#fff" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>Total Due</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>₹{summary.totalDue.toLocaleString()}</p>
          </div>
          
          <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#fff" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>Payment Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Paid:</span>
                <span>{summary.paidCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Pending:</span>
                <span>{summary.pendingCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Overdue:</span>
                <span>{summary.overdueCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Partially Paid:</span>
                <span>{summary.partiallyPaidCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Operations */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <span style={{ marginRight: "10px" }}>
            <strong>{sortedData.length}</strong> records found
          </span>
          <span>
            <strong>{selectedRows.length}</strong> records selected
          </span>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <CSVLink
            data={getExportData().data}
            headers={getExportData().headers.map(header => ({ label: header, key: header.toLowerCase().replace(' ', '_') }))}
            filename={`${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`}
            className="csv-link"
            style={{ textDecoration: "none" }}
          >
            <button style={{ padding: "8px 12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Export CSV
            </button>
          </CSVLink>
          
          <button 
            onClick={exportToPDF}
            style={{ padding: "8px 12px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Export PDF
          </button>
          
          <button 
            onClick={printReport}
            style={{ padding: "8px 12px", backgroundColor: "#607D8B", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Print
          </button>
          
          <button 
            onClick={emailReport}
            style={{ padding: "8px 12px", backgroundColor: "#FF9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Email
          </button>
          
          <button 
            onClick={saveReportTemplate}
            style={{ padding: "8px 12px", backgroundColor: "#9C27B0", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Save Template
          </button>
        </div>
      </div>

      {/* Table View */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "left" }}>
                <input 
                  type="checkbox" 
                  checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              
              {columnsToShow.id && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "left", cursor: "pointer" }}
                  onClick={() => requestSort("id")}
                >
                  ID {sortConfig.key === "id" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
              
              {columnsToShow.name && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "left", cursor: "pointer" }}
                  onClick={() => requestSort("name")}
                >
                  Student Name {sortConfig.key === "name" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
              
              {columnsToShow.class && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "left", cursor: "pointer" }}
                  onClick={() => requestSort("class")}
                >
                  Class {sortConfig.key === "class" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
              
              {columnsToShow.paid && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "right", cursor: "pointer" }}
                  onClick={() => requestSort("paid")}
                >
                  Amount Paid {sortConfig.key === "paid" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
              
              {columnsToShow.due && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "right", cursor: "pointer" }}
                  onClick={() => requestSort("due")}
                >
                  Pending Dues {sortConfig.key === "due" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
              
              {columnsToShow.status && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "left", cursor: "pointer" }}
                  onClick={() => requestSort("status")}
                >
                  Payment Status {sortConfig.key === "status" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
              
              {columnsToShow.date && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "left", cursor: "pointer" }}
                  onClick={() => requestSort("date")}
                >
                  Payment Date {sortConfig.key === "date" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
              
              {columnsToShow.mode && (
                <th 
                  style={{ padding: "12px 8px", borderBottom: "2px solid #ddd", textAlign: "left", cursor: "pointer" }}
                  onClick={() => requestSort("mode")}
                >
                  Payment Mode {sortConfig.key === "mode" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {sortedData.map((row) => (
              <tr 
                key={row.id}
                style={{ 
                  backgroundColor: selectedRows.includes(row.id) ? "#e3f2fd" : "transparent",
                  borderBottom: "1px solid #ddd"
                }}
              >
                <td style={{ padding: "8px" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleRowSelection(row.id)}
                  />
                </td>
                
                {columnsToShow.id && <td style={{ padding: "8px" }}>{row.id}</td>}
                {columnsToShow.name && <td style={{ padding: "8px" }}>{row.name}</td>}
                {columnsToShow.class && <td style={{ padding: "8px" }}>{row.class}</td>}
                {columnsToShow.paid && <td style={{ padding: "8px", textAlign: "right" }}>₹{row.paid}</td>}
                {columnsToShow.due && <td style={{ padding: "8px", textAlign: "right" }}>₹{row.due}</td>}
                {columnsToShow.status && (
                  <td style={{ padding: "8px" }}>
                    <span style={{ 
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      backgroundColor: 
                        row.status === "Paid" ? "#e8f5e9" : 
                        row.status === "Pending" ? "#fff8e1" : 
                        row.status === "Overdue" ? "#ffebee" : 
                        row.status === "Partially Paid" ? "#e3f2fd" : "#f5f5f5",
                      color: 
                        row.status === "Paid" ? "#2e7d32" : 
                        row.status === "Pending" ? "#f57f17" : 
                        row.status === "Overdue" ? "#c62828" : 
                        row.status === "Partially Paid" ? "#1565c0" : "#333"
                    }}>
                      {row.status}
                    </span>
                  </td>
                )}
                {columnsToShow.date && <td style={{ padding: "8px" }}>{row.date}</td>}
                {columnsToShow.mode && <td style={{ padding: "8px" }}>{row.mode}</td>}
              </tr>
            ))}
            
            {sortedData.length === 0 && (
              <tr>
                <td colSpan="9" style={{ padding: "20px", textAlign: "center" }}>
                  No records found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
          
          {/* Table Footer with Totals */}
          <tfoot style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}>
            <tr>
              <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd" }}></td>
              
              {columnsToShow.id && <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd" }}></td>}
              {columnsToShow.name && <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd" }}>Total</td>}
              {columnsToShow.class && <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd" }}></td>}
              
              {columnsToShow.paid && (
                <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd", textAlign: "right" }}>
                  ₹{filteredData.reduce((sum, row) => sum + row.paid, 0).toLocaleString()}
                </td>
              )}
              
              {columnsToShow.due && (
                <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd", textAlign: "right" }}>
                  ₹{filteredData.reduce((sum, row) => sum + row.due, 0).toLocaleString()}
                </td>
              )}
              
              {columnsToShow.status && <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd" }}></td>}
              {columnsToShow.date && <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd" }}></td>}
              {columnsToShow.mode && <td style={{ padding: "12px 8px", borderTop: "2px solid #ddd" }}></td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Print-specific styles hidden in normal view */}
      <style type="text/css" media="print">
        {`
          @page {
            margin: 0.5cm;
            size: landscape;
          }
          
          body {
            font-size: 12pt;
          }
          
          .reports-container {
            padding: 0 !important;
          }
          
          button, .csv-link, input[type="checkbox"] {
            display: none !important;
          }
          
          h1 {
            text-align: center;
            font-size: 18pt !important;
            margin-bottom: 10px !important;
          }
          
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          
          th, td {
            border: 1px solid #000 !important;
            padding: 5px !important;
          }
          
          thead {
            display: table-header-group;
          }
          
          tfoot {
            display: table-footer-group;
          }
        `}
      </style>
    </div>
  );
};

export default Reports;