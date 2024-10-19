import { ToastContainer } from "react-toastify"; // Import toast

const Dashboard = ({ element }) => {
  return (
    <div>
      {element}
      <ToastContainer
        position="bottom-right" // Set position to bottom-right
        autoClose={5000} // Automatically close after 5 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Display newest on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Dashboard;
