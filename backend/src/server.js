const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { runStartupTasks, setupGracefulShutdown } = require("./utils/startup");

const emailRoutes = require("./routes/emailRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

connectDB();

app.use(helmet());

const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use("/health", healthRoutes);

app.use("/api/emails", emailRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Email Analysis System API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = 5000;

const server = app.listen(PORT, async () => {
  console.log(`Server running in on port ${PORT}`);
  console.log(`Email Analysis System API is ready!`);

  await runStartupTasks();
});

setupGracefulShutdown();

module.exports = app;
