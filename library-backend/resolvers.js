const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const { GraphQLError } = require("graphql/error");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate("author", {
        name: 1,
        born: 1,
      });

      if (!args.author && !args.genre) {
        return books;
      }

      if (!args.author && args.genre) {
        const booksByGenre = books.filter((book) =>
          book.genres.includes(args.genre),
        );

        return booksByGenre;
      }

      if (args.author && !args.genre) {
        const booksByAuthor = books.filter(
          (book) => book.author.name === args.author,
        );

        return booksByAuthor;
      }

      const booksByAuthor = books.filter(
        (book) => book.author.name === args.author,
      );

      return booksByAuthor.filter((book) => book.genres.includes(args.genre));
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      const authorName = root.name;
      const author = await Author.exists({ name: authorName });
      const books = await Book.find({ author: author._id });
      return books.length;
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          code: "BAD_USER_INPUT",
          invalidArgs: args.username,
          error,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password != "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const author = await Author.exists({ name: args.author });

      if (!author) {
        const newAuthor = new Author({ name: args.author, born: null });

        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError(`Creating author failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }

        const book = new Book({ ...args, author: newAuthor._id });

        try {
          const bookAdded = await (
            await book.save()
          ).populate("author", {
            name: 1,
            born: 1,
          });
          pubsub.publish("BOOK_ADDED", { bookAdded });

          return bookAdded;
        } catch (error) {
          throw new GraphQLError(`Saving book failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
              error,
            },
          });
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        const bookAdded = await (
          await book.save()
        ).populate("author", {
          name: 1,
          born: 1,
        });
        pubsub.publish("BOOK_ADDED", { bookAdded });

        return bookAdded;
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.name = args.name;
      author.born = args.setBornTo;

      try {
        return author.save();
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: [args.name, args.setBornTo],
            error,
          },
        });
      }
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
