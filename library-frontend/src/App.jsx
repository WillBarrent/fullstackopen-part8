import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import Recommended from "./components/Recommended";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import { addBookToCache } from "./utils/cache";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [notification, setNotification] = useState("");
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      addBookToCache(client.cache, addedBook);
      setNotification("New book has been added!");
      setTimeout(() => {
        setNotification("")
      }, 3000);
    },
  });

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem("user-token");
    client.resetStore();
    setPage("authors");
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

      <div>{notification}</div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <Recommended show={page === "recommended"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
