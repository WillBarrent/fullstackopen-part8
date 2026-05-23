import { gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query GetAllBooks($genre: String) {
    allBooks(genre: $genre) {
      author {
        bookCount
        born
        name
      }
      genres
      published
      title
      id
    }
  }
`;

export const NEW_BOOK = gql`
  mutation Mutation(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      author {
        bookCount
        born
        name
      }
      genres
      id
      published
      title
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      bookCount
      born
      id
      name
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query {
    me {
      favoriteGenre
      id
      username
    }
  }
`;