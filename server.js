//Server files works for connections management
// This won't work without config.env

const mongoose = require("mongoose"); //- DB manager
const dotenv = require("dotenv"); //-For config files

dotenv.config({ path: "./config.env" }); //- Import config
const app = require("./app"); //- application separated form server (to ease manage of the server part)
//DB conection establishement
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
//DB connect command - current setup is for my DB for natours pet project
mongoose.connect(DB, {}).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000; // - read port from config.env
// Run sever
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Ignore this part for now, this is just simple handler of unhandled rejections
// Somewhere there was one for unhandeled exeptions...
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
