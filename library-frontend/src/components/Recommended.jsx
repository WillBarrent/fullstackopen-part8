import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";

const Recommended = (props) => {
  const result = useQuery(ME);
  const books = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading || books.loading) {
    return <div>loading...</div>;
  }

  const favoriteGenre = result.data.me.favoriteGenre;
  const booksByGenre = books.data.allBooks.filter((book) =>
    book.genres.includes(favoriteGenre),
  );


  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <i>{favoriteGenre}</i>
      </p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
