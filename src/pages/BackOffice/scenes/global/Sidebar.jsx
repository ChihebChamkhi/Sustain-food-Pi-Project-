import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../../../context/AuthContext";
import { logoutUser } from "../../../../services/api_auth";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAvatarUpload = () => {
    // Implement your avatar upload logic here
    console.log("Avatar upload triggered");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout(); // Call the logout function from AuthContext
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  SustainFood
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center"
                position="relative"
              >
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${colors.greenAccent[500]}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.primary[400],
                    cursor: "pointer",
                  }}
                >
                  {user?.avatar ? (
                    <img
                      alt="profile-user"
                      src={user.avatar}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = `../../assets/user.png`;
                        e.target.style.objectFit = "contain";
                        e.target.style.padding = "20px";
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h2"
                      sx={{
                        color: colors.grey[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 'calc(50% - 60px)',
                    backgroundColor: colors.greenAccent[500],
                    '&:hover': {
                      backgroundColor: colors.greenAccent[600],
                    }
                  }}
                  onClick={handleAvatarUpload}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name || "Admin"}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user?.role === 'admin'
                    ? 'Super Admin'
                    : `${user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Admin`}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>

            {/* Dropdown for Management */}
            <SubMenu
              title="Management"
              icon={<PeopleOutlinedIcon />}
              style={{ color: colors.grey[100] }}
            >
              <Item
                title="Manage Users"
                to="/admin/team"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Manage Announcements"
                to="/admin/announcements-backoffice"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Manage Reservations"
                to="/admin/reservationbackoffice"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <Item
              title="Contacts Information"
              to="/admin/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices Balances"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/admin/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/admin/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/admin/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/admin/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/admin/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/admin/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/admin/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          {/* Logout Button at the bottom */}
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              width: '100%',
              paddingLeft: isCollapsed ? undefined : "10%",
            }}
          >
            <MenuItem
              onClick={handleLogout}
              icon={<LogoutIcon />}
              style={{
                color: colors.redAccent[500],
                backgroundColor: colors.primary[400],
                margin: "10px 0",
              }}
            >
              {!isCollapsed && (
                <Typography 
                  variant="h6" 
                  color={colors.redAccent[500]}
                  fontWeight="bold"
                >
                  Logout
                </Typography>
              )}
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
