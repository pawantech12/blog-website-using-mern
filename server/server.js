// configuring dotenv
require("dotenv").config({ path: "./.env" });
const express = require("express");
const connectDB = require("./utils/db_connect");
const cors = require("cors");
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

// importing routes
const authenticationRouter = require("./routers/authentication.router.js");
const blogRouter = require("./routers/blog.router.js");
const categoryRouter = require("./routers/category.router.js");
const contactRouter = require("./routers/contact.router.js");
const subscriptionRouter = require("./routers/subscription.router.js");
app.use("/api", authenticationRouter);
app.use("/api", contactRouter);
app.use("/api", subscriptionRouter);
app.use("/blog", blogRouter);
app.use("/blog", categoryRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
});
