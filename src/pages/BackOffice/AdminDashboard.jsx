import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; 

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome to Admin Dashboard, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
