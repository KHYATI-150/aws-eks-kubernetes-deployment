const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const os = require("os");

const { port, appName, appVersion, readyDelayMs } = require("./config");
const { router: healthRoutes, markReady } = require("./routes/health");
const infoRoutes = require("./routes/info");
const loadRoutes = require("./routes/load");

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());

// Serve frontend
app.use(express.static("public"));

// Routes
app.use("/", healthRoutes);
app.use("/info", infoRoutes);
app.use("/load", loadRoutes);

// Start server
const server = app.listen(port, () => {
  console.log(
    `${appName} ${appVersion} running on port ${port} (instance: ${os.hostname()})`
  );

  if (readyDelayMs > 0) {
    setTimeout(markReady, readyDelayMs);
  } else {
    markReady();
  }
});

// Graceful shutdown (important for Kubernetes)
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
