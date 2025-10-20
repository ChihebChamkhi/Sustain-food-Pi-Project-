import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../../../components/Header";
import {
  getAllReservations,
  deleteReservation,
} from "../../../../services/api_reservationbackoffice";

const ManageReservation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch reservations on mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getAllReservations();
        setReservations(
          response.data.map((reservation) => ({
            ...reservation,
            id: reservation._id,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Failed to fetch reservations. Please try again later.");
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Handle delete reservation
  const handleDeleteReservation = async () => {
    if (reservationToDelete) {
      try {
        await deleteReservation(reservationToDelete);
        setReservations((prev) =>
          prev.filter((reservation) => reservation.id !== reservationToDelete)
        );
        setSuccess("Reservation deleted successfully");
      } catch (error) {
        console.error("Error deleting reservation:", error);
        setError("Failed to delete reservation. Please try again.");
      }
    }
    setOpenDeleteDialog(false);
  };

  // Confirm delete reservation
  const confirmDeleteReservation = (id) => {
    setReservationToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  // Status chip color mapping
  const statusColorMap = {
    pending: colors.blueAccent[500],
    approved: colors.greenAccent[500],
    rejected: colors.redAccent[500],
    completed: colors.greenAccent[700],
    cancelled: colors.grey[500],
  };

  // Columns for the DataGrid
  const columns = [
    {
      field: "announcement",
      headerName: "Announcement",
      flex: 1,
      valueGetter: (params) => params.row.announcement?.title || "N/A",
      renderCell: (params) => (
        <Typography variant="body2" color={colors.grey[100]}>
          {params.row.announcement?.title || "N/A"}
        </Typography>
      ),
    },
    {
      field: "reserver",
      headerName: "Reserver",
      flex: 1,
      valueGetter: (params) => params.row.reserver?.name || "N/A",
      renderCell: (params) => (
        <Typography variant="body2" color={colors.grey[100]}>
          {params.row.reserver?.name || "N/A"}
        </Typography>
      ),
    },
    {
      field: "announcer",
      headerName: "Announcer",
      flex: 1,
      valueGetter: (params) => params.row.announcer?.name || "N/A",
      renderCell: (params) => (
        <Typography variant="body2" color={colors.grey[100]}>
          {params.row.announcer?.name || "N/A"}
        </Typography>
      ),
    },
    { 
      field: "quantity", 
      headerName: "Quantity", 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color={colors.grey[100]}>
          {params.row.quantity}
        </Typography>
      ),
    },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          sx={{
            backgroundColor: statusColorMap[params.row.status] || colors.grey[700],
            color: colors.grey[100],
            textTransform: 'capitalize',
            minWidth: 80,
          }}
        />
      ),
    },
    {
      field: "pickupTime",
      headerName: "Pickup Time",
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleString();
      },
      renderCell: (params) => (
        <Typography variant="body2" color={colors.grey[100]}>
          {params.value ? new Date(params.value).toLocaleString() : "N/A"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={() => confirmDeleteReservation(row.id)}
            sx={{
              backgroundColor: colors.redAccent[600],
              '&:hover': {
                backgroundColor: colors.redAccent[700],
              }
            }}
          >
            <DeleteIcon sx={{ fontSize: 16, mr: 1 }} />
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Header
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="h4" color={colors.grey[100]}>
                Reservations Control
              </Typography>
            </Box>
          }
          subtitle="Managing Reservations"
        />
      </Box>

      <Box 
        sx={{ 
          height: 400, 
          width: "100%",
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${colors.grey[800]} !important`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={reservations}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          sx={{
            backgroundColor: colors.primary[400],
            '& .MuiDataGrid-cell:hover': {
              color: colors.greenAccent[300],
            },
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
          }
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.grey[100] }}>
            Are you sure you want to delete this reservation? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)} 
            sx={{ color: colors.grey[100] }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteReservation}
            color="error"
            variant="contained"
            sx={{
              backgroundColor: colors.redAccent[600],
              '&:hover': {
                backgroundColor: colors.redAccent[700],
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageReservation;