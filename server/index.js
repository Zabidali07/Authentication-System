const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan"); //helps you see who is making what request
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const { authorize } = require("./middlewares/auth");
const userRoutes = require("./routes/users");
const fileRoutes = require("./routes/image");
require("dotenv").config(); //will add all the variables inside .env as global variable

const { NODE_PORT, NODE_ENV, CLIENT_URL, DATABASE_URL } = process.env; //process.env by this we use each .env variable
const PORT = 8000;
const isDevelopment = NODE_ENV === "development";

const app = express();

if (isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

if (isDevelopment) {
  // app.use(cors({ origin: CLIENT_URL, optionsSuccessStatus: 200 }))
  // This is very useful in production
  app.use(cors());
}
app.use("/uploads", express.static("./server/uploads"));

app.use("/api", authRoutes);
app.use("/api/users", authorize, userRoutes);
app.use("/api/files", fileRoutes);

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    app.listen(8000, () => {
      console.log(`DB connected to server running at ${PORT} - - ${NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.log(`Db connection failed -- ${err}`);
  });

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const morgan = require("morgan");  //helps you see who is making what request
// const bodyParser = require("body-parser");
// require("dotenv").config();
// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(8000, () => {
//     console.log(`DB se to server running at ${process.env.NODE_PORT} `);
// })
