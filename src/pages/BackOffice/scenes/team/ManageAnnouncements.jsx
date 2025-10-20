// pages/ManageAnnouncements.jsx
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../../../components/Header";
import {
  getAllAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
} from "../../../../services/api_announcementsbackOffice";

const ManageAnnouncements = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const [editedAnnouncement, setEditedAnnouncement] = useState({});
  const [pageSize, setPageSize] = useState(5);

  // Fetch announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getAllAnnouncements(token);
        setAnnouncements(data.map((announcement) => ({ ...announcement, id: announcement._id })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Handle delete announcement
  const handleDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      try {
        await deleteAnnouncement(announcementToDelete);
        setAnnouncements(announcements.filter((announcement) => announcement._id !== announcementToDelete));
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
    setOpenDeleteDialog(false);
  };

  // Confirm delete announcement
  const confirmDeleteAnnouncement = (id) => {
    setAnnouncementToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle update announcement
  const handleUpdateAnnouncement = async () => {
    if (announcementToEdit) {
      try {
        const token = localStorage.getItem("token");
        await updateAnnouncement(announcementToEdit, editedAnnouncement, token);
        setAnnouncements(announcements.map((announcement) =>
          announcement._id === announcementToEdit ? { ...announcement, ...editedAnnouncement } : announcement
        ));
        setOpenEditDialog(false);
      } catch (error) {
        console.error("Error updating announcement:", error);
      }
    }
  };

  // Open edit dialog with announcement data
  const openEditDialogHandler = (announcement) => {
    setAnnouncementToEdit(announcement._id);
    setEditedAnnouncement(announcement);
    setOpenEditDialog(true);
  };

  // Columns for the DataGrid
  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "pickupTime", headerName: "Pickup Time", flex: 1 },
    { field: "expiryDate", headerName: "Expiry Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={() => openEditDialogHandler(row)}
          >
            <EditIcon sx={{ fontSize: 16, mr: 1 }} />
            Edit
          </Button>
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={() => confirmDeleteAnnouncement(row.id)}
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="h4">Announcements Control</Typography>
            </Box>
          }
          subtitle="Managing Announcements"
        />
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          checkboxSelection
          rows={announcements}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this announcement? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAnnouncement} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Announcement</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              value={editedAnnouncement.title || ""}
              onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editedAnnouncement.description || ""}
              onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="Category"
              value={editedAnnouncement.category || ""}
              onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Price"
              value={editedAnnouncement.price || ""}
              onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, price: e.target.value })}
              fullWidth
            />
            <TextField
              label="Location"
              value={editedAnnouncement.location || ""}
              onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, location: e.target.value })}
              fullWidth
            />
            <TextField
              label="Pickup Time"
              value={editedAnnouncement.pickupTime || ""}
              onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, pickupTime: e.target.value })}
              fullWidth
            />
            <TextField
              label="Expiry Date"
              value={editedAnnouncement.expiryDate || ""}
              onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, expiryDate: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateAnnouncement} color="success" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAnnouncements;
