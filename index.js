const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./routes/config");
const routes = require("./routes/routes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function connectMongo() {
  try {
    await mongoose.connect(config.dbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("error in connection with mongoDB", error);
    process.exit(1);
  }
}

app.listen(process.env.PORT || config.port, async () => {
  console.log(
    `Todo app listening on http://localhost:${config.port} ---------> ${config.port}`
  );
  await connectMongo();
  await routes(app);
});
