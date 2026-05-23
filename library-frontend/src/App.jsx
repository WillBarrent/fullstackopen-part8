import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient } from "@apollo/client/react";
import Recommended from "./components/Recommended";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const client = useApolloClient();

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem("user-token");
    client.resetStore();
    setPage("authors")
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <button onClick={() => setPage("recommended")}>recommend</button>
        ) : null}
        {token ? (
          <button onClick={() => setPage("add")}>add book</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
        {token ? <button onClick={onLogout}>logout</button> : null}
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <Recommended show={page === "recommended"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
