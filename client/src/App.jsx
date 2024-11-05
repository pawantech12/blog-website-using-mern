import Footer from "./components/Footer";
import { Navbar } from "./components/Navbar";

function App({ element }) {
  return (
    <>
      <Navbar />
      <main className="">
        {element}
        {/* <ToastContainer
          position="bottom-right" // Set position to bottom-right
          autoClose={5000} // Automatically close after 5 seconds
          hideProgressBar={false} // Show progress bar
          newestOnTop={false} // Display newest on top
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
      </main>
      <Footer />
    </>
  );
}

export default App;
