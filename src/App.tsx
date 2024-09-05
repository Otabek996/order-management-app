import Home from "./pages/Home";
import "./App.css";

function App() {


  return (
    <div className="App">
      {/* <div>
        <input
          type="text"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
        />
        <button onClick={handleAddOrder}>Add Order</button>
      </div> */}

      {/* <div>
        <select value={count} onChange={(e) => setCount(e.target.value)}>
          <option value="''">all</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div> */}

      {/* <ul>
        {Array.isArray(data) ? (
          data.map(
            (item: {
              id: string;
              username: string;
              status: string;
              createdAt: string;
            }) => (
              <li key={item.id} onClick={() => handleDeleteOrder(item.id)}>
                <div>Username: {item.username}</div>
                <div>Status: {item.status}</div>
                <div>Created At: {item.createdAt}</div>
              </li>
            )
          )
        ) : (
          <li key={data.id}>
            <div>Username: {data.username}</div>
            <div>Status: {data.status}</div>
            <div>Created At: {data.createdAt}</div>
          </li>
        )}
      </ul> */}

      <Home />
    </div>
  );
}

export default App;
