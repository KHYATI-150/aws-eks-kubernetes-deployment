module.exports = {
  port: process.env.PORT || 3000,
  appName: process.env.APP_NAME || "Kubernetes Demo Service",
  appVersion: process.env.APP_VERSION || "v1",
  readyDelayMs: Number(process.env.READY_DELAY_MS || 0)
};
