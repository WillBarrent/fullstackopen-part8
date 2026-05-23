import { useApolloClient, useMutation } from "@apollo/client/react";
import { LOGIN, ME } from "../queries";
import { useState } from "react";

const Login = ({ setToken, setPage, show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const client = useApolloClient();
  const [login] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
      setPage("authors");
      await client.refetchQueries({
        include: [ME],
      });
    },
    onError: () => {
      setError("login failed");
    },
  });

  if (!show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>login</h2>
      {error ? <p>{error}</p> : null}
      <form onSubmit={submit}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </label>
        </div>
        <button>login</button>
      </form>
    </div>
  );
};

export default Login;
