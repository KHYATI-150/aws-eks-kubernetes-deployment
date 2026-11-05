const express = require("express");
const router = express.Router();

let ready = false;

function markReady() {
  ready = true;
}

// Liveness probe
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Readiness probe
router.get("/ready", (req, res) => {
  if (!ready) {
    return res.status(503).json({ status: "starting" });
  }
  res.status(200).json({ status: "ready" });
});

module.exports = { router, markReady };
