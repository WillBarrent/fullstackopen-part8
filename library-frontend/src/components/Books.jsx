import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = (props) => {
  const [genre, setGenre] = useState("");
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  let genres = [];
  result.data.allBooks.forEach((book) => {
    genres.push(...book.genres);
  });
  genres = [...new Set(genres)].concat("all genres");

  return (
    <div>
      <h2>books</h2>
      {genre === "" ? null : (
        <p>
          in genre <i>{genre}</i>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenre(genre === "all genres" ? "" : genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
