const express = require("express");
const os = require("os");
const { burnCpu } = require("../utils/cpu");

const router = express.Router();

/**
 * GET /load
 *
 * Increases CPU usage to trigger Kubernetes HPA.
 * This is NOT a production endpoint.
 */
router.get("/", (req, res) => {
  const requestedMs = Number(req.query.ms || 700);

  // Safety limits
  const workMs = Math.max(200, Math.min(requestedMs, 2000));

  burnCpu(workMs);

  res.json({
    message: "CPU load generated",
    durationMs: workMs,
    instance: os.hostname(),
    purpose: "Used to demonstrate Kubernetes autoscaling"
  });
});

module.exports = router;
