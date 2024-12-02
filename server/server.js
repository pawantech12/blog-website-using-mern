// configuring dotenv
require("dotenv").config({ path: "./.env" });
const express = require("express");

const http = require("http");
const connectDB = require("./utils/db_connect");
const cors = require("cors");
const cron = require("node-cron");
const app = express();
const server = http.createServer(app);

app.use(express.json());

const corsOptions = {
  origin: [
    "https://blog-website-using-mern-vw2v.onrender.com",
    "http://localhost:5173",
  ],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Optional: 1-day expiration
  })
);

const PORT = process.env.PORT || 5000;

// importing routes
const authenticationRouter = require("./routers/authentication.router.js");
const blogRouter = require("./routers/blog.router.js");
const categoryRouter = require("./routers/category.router.js");
const contactRouter = require("./routers/contact.router.js");
const subscriptionRouter = require("./routers/subscription.router.js");
const commentRouter = require("./routers/comment.router.js");
const passwordRecoveryRouter = require("./routers/password.recovery.router.js");
const signAuthRouter = require("./routers/signauth.router.js");
const { initializeSocket } = require("./socket.js");
const Notification = require("./models/notification.model.js");

app.use("/auth", signAuthRouter);
app.use("/api", authenticationRouter);
app.use("/api", contactRouter);
app.use("/api", subscriptionRouter);
app.use("/blog", blogRouter);
app.use("/blog", categoryRouter);
app.use("/blog", commentRouter);
app.use("/password", passwordRecoveryRouter);

// Initialize Socket.IO
initializeSocket(server);

// Schedule a cron job to delete notifications older than 3 days
cron.schedule("0 0 * * *", async () => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 3); // 3 days ago

  try {
    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
    });
    console.log(
      `${result.deletedCount} notifications older than 10 minutes deleted`
    );
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
});
