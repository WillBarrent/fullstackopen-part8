require("dotenv").config();

const connectToDatabase = require("./db");
const startServer = require("./server");

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

const main = async () => {
  await connectToDatabase(MONGO_URI);
  startServer(PORT);
};

main();
