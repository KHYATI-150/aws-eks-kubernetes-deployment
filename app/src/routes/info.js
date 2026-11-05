const express = require("express");
const os = require("os");
const router = express.Router();
const { appName, appVersion } = require("../config");

// Shows pod / instance identity
router.get("/", (req, res) => {
  res.json({
    name: appName,
    version: appVersion,
    instance: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
