import Footer from "./components/Footer";
import { Navbar } from "./components/Navbar";

function App({ element }) {
  return (
    <>
      <Navbar />
      <main className="">{element}</main>
      <Footer />
    </>
  );
}

export default App;
