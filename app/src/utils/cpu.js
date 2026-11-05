/**
 * Burns CPU for a fixed duration.
 *
 * This exists ONLY to demonstrate Kubernetes autoscaling.
 * HPA reacts to CPU usage, not traffic.
 */
function burnCpu(durationMs) {
  const end = Date.now() + durationMs;
  let value = 0;

  while (Date.now() < end) {
    value = Math.sqrt(value + Math.random() * 1000);
  }

  return value;
}

module.exports = { burnCpu };
