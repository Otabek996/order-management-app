import EnhancedTable from "../components/Table";

function Home() {
  const logOut = () => {
    localStorage.setItem("accessToken", "");
    localStorage.setItem("refreshToken", "");

    window.location.href = "/sign-in";
  };

  return (
    <section id="home" className="home">
      <button onClick={logOut}>Log out</button>
      <EnhancedTable />
    </section>
  );
}

export default Home;
