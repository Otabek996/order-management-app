import EnhancedTable from "../components/Table";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const authContext = useContext(AuthContext);

  return (
    <section id="home" className="home">
      <button onClick={authContext?.logout}>Log out</button>
      <EnhancedTable />
    </section>
  );
}

export default Home;
