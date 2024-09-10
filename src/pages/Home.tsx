import EnhancedTable from "../components/Table";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.setItem("accessToken", "");
    localStorage.setItem("refreshToken", "");

    // window.location.href = "/sign-in";
    navigate("/order-management-app/sign-in");
  };

  return (
    <section id="home" className="home">
      <button onClick={logOut}>Log out</button>
      <EnhancedTable />
    </section>
  );
}

export default Home;
