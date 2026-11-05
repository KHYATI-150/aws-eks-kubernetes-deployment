async function fetchJson(url) {
  const res = await fetch(url);
  return { status: res.status, data: await res.json() };
}

async function refreshInfo() {
  const info = await fetchJson("/info");
  const ready = await fetchJson("/ready");

  document.getElementById("version").textContent = info.data.version;
  document.getElementById("instance").textContent = info.data.instance;

  document.getElementById("status").textContent =
    ready.status === 200 ? "Running & Ready" : "Starting…";
}

async function generateLoad() {
  const res = await fetchJson("/load");
  document.getElementById("output").textContent =
    JSON.stringify(res.data, null, 2);
}

document.getElementById("loadBtn").addEventListener("click", generateLoad);

refreshInfo();
setInterval(refreshInfo, 5000);
