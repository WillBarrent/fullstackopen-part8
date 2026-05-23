import { useMutation, useQuery } from "@apollo/client/react";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";
import { useState } from "react";

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const authors = result.data.allAuthors.filter((a) => !a.born);

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token ? (
        <>
          <h2>Set birthyear</h2>
          {authors.length !== 0 ? (
            <AuthorsForm authors={authors} />
          ) : (
            <div>No authors...</div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const AuthorsForm = (props) => {
  const [name, setName] = useState(props.authors[0].name);
  const [born, setBorn] = useState("");

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = (event) => {
    event.preventDefault();

    updateAuthor({ variables: { name, setBornTo: Number(born) } });

    setName("");
    setBorn("");
  };

  return (
    <form onSubmit={submit}>
      <label>
        name
        <select name="name" onChange={(e) => setName(e.target.value)}>
          {props.authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        born
        <input value={born} onChange={({ target }) => setBorn(target.value)} />
      </label>
      <button type="submit">update author</button>
    </form>
  );
};

export default Authors;
