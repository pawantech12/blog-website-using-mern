import { Navbar } from "./components/Navbar";

function App({ element }) {
  return (
    <>
      <Navbar />
      <div className="">{element}</div>
    </>
  );
}

export default App;
