import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import ShieldIcon from "@mui/icons-material/Shield";
import DownloadIcon from "@mui/icons-material/Download";
import Header from "../../../../components/Header";
import { getAllUsers, deleteUser, blockUser } from "../../../../services/api_auth";
import * as XLSX from "xlsx";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [blockAction, setBlockAction] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getAllUsers(token);
        setUsers(data.map((user) => ({ ...user, id: user._id })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const exportToExcel = () => {
    // Prepare data for export
    const dataToExport = filteredUsers.map(user => {
      const baseData = {
        Name: user.name,
        Email: user.email,
        Role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        Status: user.isBlocked ? "Blocked" : "Active",
        "Created At": new Date(user.createdAt).toLocaleDateString()
      };
      
      // Add role-specific fields
      if (user.role === "business") {
        return {
          ...baseData,
          "Company Name": user.companyName || "N/A",
          "Registration Number": user.matricule || "N/A",
          Address: user.address || "N/A",
          Website: user.website || "N/A"
        };
      } else if (user.role === "individual") {
        return {
          ...baseData,
          "Phone Number": user.phoneNumber || "N/A",
          Address: user.address || "N/A"
        };
      } else if (user.role === "association") {
        return {
          ...baseData,
          "Organization Name": user.organizationName || "N/A",
          Address: user.address || "N/A",
          "Registration Number": user.matricule || "N/A"
        };
      }
      return baseData;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
    // Auto-size columns
    const wscols = [
      {wch: 20}, // Name
      {wch: 25}, // Email
      {wch: 15}, // Role
      {wch: 10}, // Status
      {wch: 15}, // Created At
      ...(selectedRole === "business" || selectedRole === "all" ? 
        [{wch: 20}, {wch: 20}, {wch: 25}, {wch: 20}] : []), // Business fields
      ...(selectedRole === "individual" || selectedRole === "all" ? 
        [{wch: 15}, {wch: 25}] : []), // Individual fields
      ...(selectedRole === "association" || selectedRole === "all" ? 
        [{wch: 20}, {wch: 25}, {wch: 20}] : []) // Association fields
    ];
    worksheet["!cols"] = wscols;
    
    XLSX.writeFile(workbook, `Users_Export_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        const token = localStorage.getItem("token");
        await deleteUser(userToDelete, token);
        setUsers(users.filter((user) => user._id !== userToDelete));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    setOpenDialog(false);
  };

  const confirmDeleteUser = (id) => {
    setUserToDelete(id);
    setOpenDialog(true);
  };

  const toggleBlockUser = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await blockUser(id, !currentStatus, token);
      setUsers(users.map(user =>
        user._id === id ? { ...user, isBlocked: !currentStatus } : user
      ));
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };

  const confirmBlockUser = (id, currentStatus) => {
    setUserToBlock(id);
    setBlockAction(!currentStatus);
    setOpenBlockDialog(true);
  };

  const handleBlockUser = async () => {
    if (userToBlock !== null) {
      try {
        const token = localStorage.getItem("token");
        await blockUser(userToBlock, blockAction, token);
        setUsers(users.map(user =>
          user._id === userToBlock ? { ...user, isBlocked: blockAction } : user
        ));
      } catch (error) {
        console.error("Error blocking/unblocking user:", error);
      } finally {
        setOpenBlockDialog(false);
      }
    }
  };

  const baseColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { 
      field: "createdAt", 
      headerName: "Joined Date", 
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString()
    },
  ];

  const addRoleSpecificColumns = (role) => {
    switch (role) {
      case "business":
        return [
          { field: "companyName", headerName: "Company Name", flex: 1 },
          { field: "matricule", headerName: "Registration Number", flex: 1 },
          { field: "address", headerName: "Address", flex: 1 },
          { field: "website", headerName: "Website", flex: 1 },
        ];
      case "individual":
        return [
          { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
          { field: "address", headerName: "Address", flex: 1 },
        ];
      case "association":
        return [
          { field: "organizationName", headerName: "Organization Name", flex: 1 },
          { field: "matricule", headerName: "Registration Number", flex: 1 },
          { field: "address", headerName: "Address", flex: 1 },
        ];
      default:
        return [];
    }
  };

  const addExtraColumns = (columns, role) => [
    ...columns,
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { role } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={
            role === "admin"
              ? colors.greenAccent[600]
              : role === "business" || role === "association"
              ? colors.blueAccent[700]
              : colors.greenAccent[700]
          }
          borderRadius="4px"
        >
          {role === "admin" && <AdminPanelSettingsIcon />}
          {role === "business" && <BusinessIcon />}
          {role === "association" && <GroupIcon />}
          {role === "individual" && <AccountCircleIcon />}
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { isBlocked } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={isBlocked ? colors.redAccent[600] : colors.greenAccent[600]}
          borderRadius="4px"
        >
          <Typography color={colors.grey[100]}>
            {isBlocked ? "Blocked" : "Active"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={() => confirmDeleteUser(row.id)}
          >
            <DeleteIcon sx={{ fontSize: 16, mr: 1 }} />
            Delete
          </Button>

          <Button
            sx={{
              backgroundColor: row.isBlocked ? colors.greenAccent[600] : colors.redAccent[600],
              color: "white",
              "&:hover": {
                backgroundColor: row.isBlocked ? colors.greenAccent[700] : colors.redAccent[700],
              },
            }}
            variant="contained"
            size="small"
            onClick={() => confirmBlockUser(row.id, row.isBlocked)}
          >
            <BlockIcon sx={{ fontSize: 16, mr: 1 }} />
            {row.isBlocked ? "Unblock" : "Block"}
          </Button>
        </Box>
      ),
    },
  ];

  const filteredUsers = selectedRole === "all" ? users : users.filter((user) => user.role === selectedRole);
  const selectedColumns = addRoleSpecificColumns(selectedRole);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header 
          title={
            <Box display="flex" alignItems="center">
              <ShieldIcon sx={{ fontSize: 28, mr: 1 }} />
              <Typography variant="h4">Users Control</Typography>
            </Box>
          }
          subtitle="Managing Users" 
        />
        <Box display="flex" gap={2}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Role</InputLabel>
            <Select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Filter by Role"
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="association">Association</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportToExcel}
            sx={{
              backgroundColor: colors.blueAccent[600],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            Export to Excel
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          checkboxSelection
          rows={filteredUsers}
          columns={addExtraColumns(baseColumns.concat(selectedColumns), selectedRole)}
          loading={loading}
          getRowId={(row) => row._id}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: colors.blueAccent[700],
              fontSize: '14px'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${colors.grey[800]}`
            },
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
        <DialogTitle>
          {blockAction ? "Confirm Block User" : "Confirm Unblock User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {blockAction 
              ? "Blocking this user will prevent them from logging in. Are you sure?"
              : "Unblocking this user will allow them to log in again. Are you sure?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleBlockUser} 
            color={blockAction ? "error" : "success"} 
            variant="contained"
          >
            {blockAction ? "Block" : "Unblock"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;